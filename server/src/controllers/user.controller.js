import FriendRequest from "../models/FriendRequest.js";
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

export const sendFriendRequest = async (req,res)=>{
    try {
        const myId=req.user._id
        const recipientId =req.params.id

        if(myId===recipientId){
            return res.status(400).json({message:"You can't send friend request to yourself"})
        }

        const recipient= await User.findById(recipientId)
        if(!recipient){
            return res.status(400).json({message:"Recipient not found"})
        }

        if(recipient.friends.includes(myId)){
            return res.status(400).json({message:"You are already friends with this user"})
        }

        //check if a request already exists

        const existingRequest = await FriendRequest.findOne({
            $or:[
                {
                    senderId:myId,
                    recipient:recipientId
                },
                {
                    sender:recipientId,
                    recipient:myId
                }
            ]
        })
        
        if(existingRequest){
            return res.status(400).json({message:"A friend request already exists between you and this user"})
        }

        const friendRequest=await FriendRequest.create({
            sender:myId,
            recipient:recipientId,
        })

        res.status(201).json(friendRequest)

    } catch (error) {
        console.error("Error in sendFriendRequest controller",error);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const acceptFriendRequest = async (req,res) => {
    try {
        const requestId = req.params.id

        const friendRequest = await FriendRequest.findById(requestId)

        if(!friendRequest){
            return res.status(404).json({message:"Friend request not found"})
        }
          
        //verify the current user is the recipient
        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({message:"You are not authorized to accept this request"})
        }

        friendRequest.status="accepted"

        await friendRequest.save();

        //add each user to other friend request
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends: friendRequest.recipient}
        })

        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{friends: friendRequest.sender}
        })

        res.status(200).json({message:"Friend Request Accepted"})
    } catch (error) {
        console.error("Error in accepting friend request controller",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const getFriendRequests = async (req,res) => {
    try {
        const incomingReqs = await FriendRequest.find({
            recipient:req.user._id,
            status:"pending"
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage");

        const acceptedReqs= await FriendRequest.find({
            sender:req.user._id,
            status:"accepted"
        }).populate("recipient","fullName profilePic");

        res.status(200).json({acceptedReqs,incomingReqs})
    } catch (error) {
        console.error("Error in getFriendReqs controller",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const getOutgoingFriendReqs = async (req,res) => {
    try {
        const outgoingReqs = await FriendRequest.find({
            sender:req.user._id,
            status:"pending"
        }).populate("recipient","fullName profilePic nativeLanguage learningLanguage")

        res.status(200).json(outgoingReqs);
    } catch (error) {
        console.error("Error in outgoingFriendReqs controller",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}