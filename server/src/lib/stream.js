import {StreamChat} from "stream-chat"
import "dotenv/config"

const apiKey=process.env.STREAM_API_KEY
const apiSecret=process.env.STREAM_API_SECRET

if(!apiKey || !apiSecret){
    console.error("Stream API or Secret Key is missing!")
}

const streamClient=StreamChat.getInstance(apiKey,apiSecret);//connect to our account


export const upsertStreamUser= async (userData) => {
    try {
        await streamClient.upsertUsers([userData]) //create or update user
        return userData
    } catch (error) {
        console.error("Error upserting stream user",error)
    }
}

//todo:do it later
export const generateStreamToken=async(userId)=>{
    try {
        //ensure userId is a string
        const userIdStr= userId.toString();
        return streamClient.createToken(userIdStr)
    } catch (error) {
        console.log("Error in generating Stream token:",error)
    }
}