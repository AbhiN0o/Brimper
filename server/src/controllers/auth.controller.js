import User from "../models/User.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { upsertStreamUser } from "../lib/stream.js";

export const handleSignup=async(req,res)=>{
    const {email,password,fullName}=req.body
    try {
        if(!email || !password || !fullName){
            return res.status(400).json({message:"All fields are required"})
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters"})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"Email Already Exists, please use a different one"})
        }

        const index = Math.floor(Math.random()*100)+1;

        const randomAvatar=`https://avatar.iran.liara.run/public/${index}.png`

        const newUser=await User.create({
            email,
            fullName,
            password,
            profilePic:randomAvatar
        })

        try {
            await upsertStreamUser({
                id:newUser._id.toString(),
                name:newUser.fullName,
                image:newUser.profilePic || ""
            })
            console.log(`Stream user created for ${newUser._id}`)
        } catch (error) {
            console.log("Error creating stream user")
        }

        const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET,{
            expiresIn:"7d",
        })

        res.cookie("token",token,{
            maxAge:7*24*60*60*100,
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV==="production"
        })

        res.status(201).json({success:true,user:newUser,message:"Succesfully Signed In"})
    } catch (error) {
        console.log("Error in signup controller",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const handleLogin=async(req,res)=>{
    try {
        const {email,password}=req.body
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"No user found ,please sign up"})
        }
        const isPasswordCorrect= await user.matchPassword(password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid Credentilas"});
        }
        
        const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{
            expiresIn:"7d"
        })

        res.cookie("token",token,{
            maxAge:7*24*60*60*100,
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV==="production"
        })
        res.status(200).json({success:true,user,message:"Succesfully logged in!"})

    } catch (error) {
        console.log("Error in login controller",error);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const handleLogout=async(req,res)=>{
    res.clearCookie("token");
    res.status(200).json({success:true,message:"Logged Out Succesfully"})
}


export const onboard = async (req,res) => {
    try {
        const userId=req.user._id
        const {fullName,bio,nativeLanguage,learningLanguage,location}=req.body

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({
                message:"All fields are required",
                missingFields : [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean),
            });
        }

        const updatedUser=await User.findByIdAndUpdate(userId,{fullName,bio,nativeLanguage,learningLanguage,location,isOnboarded:true},{new:true})

        if(!updatedUser){
            return res.status(404).json({message:"User not found"})
        }

        try {
            await upsertStreamUser({
                id:updatedUser._id,
                name:updatedUser.fullName,
                image:updatedUser.profilePic || "",
            })
            console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`)
        } catch (error) {
            console.log("Error updating stream user during onboarding",error.message)
        }

        res.status(200).json({success:true,user:updatedUser})

    } catch (error) {
        console.log("Error in onboarding controller",error)
        res.status(500).json({message:"Internal server error"})

    }
}