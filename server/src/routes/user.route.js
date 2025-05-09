import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js"
import { getMyfriends, getRecommendedUsers, sendFriendRequest } from "../controllers/user.controller.js";


const router = express.Router()

//apply protected middleware to all routes
router.use(protectRoute)


router.get("/",protectRoute,getRecommendedUsers);

router.get("/friends",protectRoute,getMyfriends);

router.post("/friend-request/:id",sendFriendRequest)

export default router