import {
    getPosts,
    getNextPosts,
    addPost,
    getPostByUrl,
    addImageUrl,
    getImageUrl,
    updatePost,
    deletePost,
    getPostsByUserId,
    searchPosts,
} from "../services/post"
import slugify from "slugify"
import { uuid } from "uuidv4"
import db from "../models/index"

import { myCloudinary as cloudinary } from "../middleware/cloudinaryUploader"

/**CREATE */
/**READ */
export const handleGetPostsByUserId = async (req, res) => {
    const { userId } = req.query
    try {
        const response = await getPostsByUserId({ user_id: userId })
        if (response.errorCode === 2) {
            return res.status(500).json(response)
        }
        res.status(200).json(response)
    } catch (error) {
        console.error(`Error in handleGetPosts: ${error.message}`)
        res.status(500).json({
            error: error,
            message: "Internal server error",
        })
    }
}
export const handleSearchPosts = async (req, res) => {
    const { searchKeys } = req.query
    const decodedSearchKeys = decodeURIComponent(searchKeys)
    if (decodedSearchKeys.length <= 1) {
        return res.json([])
    }
    try {
        const response = await searchPosts({ searchKeys: decodedSearchKeys })
        if (response.errorCode === 2) {
            return res.status(500).json(response)
        }
        res.status(200).json(response)
    } catch (error) {
        console.error(`Error in handleGetPosts: ${error.message}`)
        res.status(500).json({
            error: error,
            message: "Internal server error",
        })
    }
}
/**UPDATE */
/**DELETE */
export const handleGetPosts = async (req, res) => {
    const { limit } = req.query

    try {
        const response = await getPosts({ limit: parseFloat(limit) })
        if (response.errorCode === 2) {
            return res.status(500).json(response)
        }
        res.status(200).json(response)
    } catch (error) {
        console.error(`Error in handleGetPosts: ${error.message}`)
        res.status(500).json({
            error: error,
            message: "Internal server error",
        })
    }
}

export const handleGetNextPosts = async (req, res) => {
    const { limit, lastPostCreatedAt } = req.query

    try {
        const response = await getNextPosts({
            limit: parseFloat(limit),
            lastPostCreatedAt: new Date(lastPostCreatedAt),
        })
        if (response.errorCode === 2) {
            return res.status(500).json(response)
        }
        res.status(200).json(response)
    } catch (error) {
        console.error(`Error in handleGetNextPosts: ${error.message}`)
        res.status(500).json({
            error: error,
            message: "Internal server error",
        })
    }
}

export const handleAddPost = async (req, res, next) => {
    const { title, price, product_condition, description, user_id, address } =
        req.body
    const postUrlSlug = slugify(title, {
        replacement: "-",
        locale: "vi",
        lower: true,
    })
    const post_url = `${postUrlSlug}-${uuid()}`
    const now = new Date()
    try {
        const response = await addPost({
            title,
            price: price.replace(",", ""),
            product_condition,
            description,
            post_url,
            user_id: parseInt(user_id),
            address,
            expiryDate: new Date(now.getTime() + 100 * 24 * 60 * 60 * 1000),
        })
        if (response.errorCode === 2) {
            const images = req.files
            const publicIds = images.map((image) => {
                return image.filename
            })
            cloudinary.api.delete_resources(publicIds)
            res.status(500).json(response)
            return
        }
        req.post = response
        next()
    } catch (error) {
        console.error(`Error in handleAddPost: ${error.message}`)
        res.status(500).json({
            error: error,
            message: "Internal server error",
        })
    }
}

export const handleAddImageUrl = async (req, res, next) => {
    const postId = req.post.id
    const images = req.files
    try {
        const response = await addImageUrl({ images, postId })
        if (response.errorCode) {
            const publicIds = images.map((image) => {
                return image.filename
            })
            cloudinary.api.delete_resources(publicIds)

            await db.Posts.destroy({
                where: {
                    id: postId,
                },
            })

            res.status(500).json(response)
            return
        }
        req.imageUrls = response
        next()
    } catch (error) {
        console.error(`Error in handleAddImageUrl: ${error.message}`)
        res.status(500).json({
            error: error,
            message: "Internal server error",
        })
    }
}

// SHOW POST WITH IMAGES:
export const handleGetPostByUrl = async (req, res, next) => {
    try {
        const post_url = req.params.post_url
        const response = await getPostByUrl(post_url)

        if (response.errorCode === 1 && !response.post) {
            res.status(404).json(response)
            return
        }

        if (response.errorCode === 2) {
            res.status(500).json(response)
            return
        }

        req.post = response
        next()
    } catch (error) {
        console.error(`Error in handleGetPostByUrl: ${error.message}`)
        res.status(500).json({
            error: error,
            message: "Internal server error",
        })
    }
}
export const handleGetImageUrl = async (req, res, next) => {
    try {
        const postId = req.post.id
        const response = await getImageUrl(postId)

        if (response.errorCode) {
            req.imageUrls = []
            req.message = response.message
        } else {
            req.imageUrls = response
        }

        next()
    } catch (error) {
        console.error(`Error in handleGetImageUrl: ${error.message}`)
        res.status(500).json({
            error: error,
            message: "Internal server error",
        })
    }
}
// update post information and post images
export const handleUpdatePost = async (req, res) => {
    const newPost = req.body
    const images = req.files // new images
    const postId = req.params.postId
    const imageIds = newPost.imageIds
    try {
        const responses = await updatePost(newPost, images, postId, imageIds)
        //FindImages - destroy old images that want to update > update imageUrl by id
        res.status(200).json(responses)
    } catch (error) {
        console.error(`Error in handleUpdatePost: ${error.message}`)
        res.status(500).json({
            error: error,
            message: "Internal server error",
        })
    }
}

export const handleDeletePost = async (req, res) => {
    const postId = req.params.postId
    const { userId } = req.query
    try {
        const responses = await deletePost({ userId, postId })
        if (responses.message === "NOT FOUND") {
            return res.status(404).json(responses)
        }
        if (responses.errorCode === 2) {
            res.status(500).json(responses)
            return
        }
        res.status(200).json(responses)
    } catch (error) {
        console.error(`Error in handleDeletePost: ${error.message}`)
        res.status(500).json({
            error: error,
            message: "Internal server error",
        })
    }
}
