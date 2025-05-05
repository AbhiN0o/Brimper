import User from "../models/User.js";
import jwt from "jsonwebtoken"


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

        //todo :create user in stream as well

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

}

export const handleLogout=async(req,res)=>{

}