import User from "../models/User.js";

export const getRecommendedUsers = async(req,res) => {
    try {
        const currentUserId=req.user._id;
        const currentUser=req.user

        const recommendedUsers = await User.find({
            $and:[
                {_id:{$ne:currentUserId}},
                {_id:{$nin: currentUser.friends}},
                {inOnboarded:true}
            ]
        })

        res.status(200).json(recommendedUsers)
    } catch (error) {
        console.log("Error in getting recommended users",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const getMyfriends = async (req,res) => {
    try {
        const user=await User.findById(req.user._id).select("friends").populate("friends","fullName profilePic nativeLanguage learningLanguage")
        res.status(200).json(user.friends)
    } catch (error) {
        console.error("Error in getMyFriends Controller",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}