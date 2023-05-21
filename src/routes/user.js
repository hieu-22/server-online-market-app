import express from "express"
import {
    handleGetFollowing,
    handleGetFollowers,
    handleUpdateUser,
    handleUpdateAvatar,
    handleUpdatePassword,
    handleGetUserById,
    handleUpdateStatus,
    handleAddRelationship,
    handleRemoveRelationShip,
    handleSavePost,
} from "../controllers/user"
import upload from "../middleware/cloudinaryUploader"
import { verifyToken } from "../middleware/verifyToken"

const router = express.Router()

/**CREATE */
router.post("/user/:userId/save-post", handleSavePost)
router.post("/user/:id/add-relationship", handleAddRelationship)
/**READ */
router.get("/user/:id", handleGetUserById)
router.get("/user/relationships/followings", verifyToken, handleGetFollowing)
router.get("/user/relationships/followers", verifyToken, handleGetFollowers)

/**UPDATE */
router.patch("/user/:id/update-user-information", verifyToken, handleUpdateUser)
router.patch(
    "/user/:id/update-avatar",
    // verifyToken,
    upload.single("avatar"),
    handleUpdateAvatar
)
router.patch("/user/:id/update-password", verifyToken, handleUpdatePassword)
router.patch("/user/:id/update-status", handleUpdateStatus)
/**DELETE */
router.delete("/user/:id/remove-relationship", handleRemoveRelationShip)

export default router
