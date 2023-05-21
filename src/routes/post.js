import express from "express"
import {
    handleGetPosts,
    handleGetNextPosts,
    handleAddPost,
    handleGetPostByUrl,
    handleAddImageUrl,
    handleGetImageUrl,
    handleUpdatePost,
    handleDeletePost,
    handleGetPostsByUserId,
    handleSearchPosts,
} from "../controllers/post"
import upload from "../middleware/cloudinaryUploader"

const router = express.Router()

/*CREATE */
// Create post, images
router.post(
    "/posts/add-post",
    upload.array("images"),
    handleAddPost,
    handleAddImageUrl,
    // final middleware
    (req, res) => {
        const post = req.post
        const imageUrls = req.imageUrls
        try {
            res.status(200).json({
                post,
                imageUrls,
                errorCode: 0,
                message: "Create Post Successfully!",
            })
        } catch (error) {
            console.error(
                `Error at the last middleware in route "/posts/add-post": ${error.message}`
            )
            res.status(500).json({
                error: error,
                message: "Internal server error",
            })
        }
    }
)

/*READ */
// Read multiple posts
router.get("/posts/first", handleGetPosts)
router.get("/posts/next", handleGetNextPosts)
router.get("/posts/getByUserId", handleGetPostsByUserId)
router.get("/posts/search", handleSearchPosts)
router.get(
    "/posts/:post_url",
    handleGetPostByUrl,
    handleGetImageUrl,
    (req, res) => {
        const post = req.post
        const imageUrls = req.imageUrls
        const message = req.message
        try {
            res.status(200).json({ post, imageUrls, message })
        } catch (error) {
            console.error(
                `Error at the last middleware in route "/posts/:post_url": ${error.message}`
            )
            res.status(500).json({
                error: error,
                message: "Internal server error",
            })
        }
    }
)
/*UPDATE */
// update post and image
router.patch("/posts/:postId/update", upload.array("images"), handleUpdatePost)

/*DELETE POST */
router.delete("/posts/:postId/delete", handleDeletePost)

export default router
