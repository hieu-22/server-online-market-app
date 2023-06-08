import {
    getAllFollowing,
    getAllFollowers,
    updateUser,
    updateAvatar,
    verifyPassword,
    updatePassword,
    getUserById,
    updateStatus,
    addRelationShip,
    removeRelationShip,
    savePost,
    getSavedPostsByUserId,
    deleteSavedPost,
} from "../services/user"
import { myCloudinary as cloudinary } from "../middleware/cloudinaryUploader"
import { deletePost } from "../services/post"
import { run } from "@babel/core/lib/transformation"

/**CREATE */
export const handleSavePost = async (req, res) => {
    const userId = req.params.userId
    const postId = req.query.postId
    try {
        const responses = await savePost({
            userId: parseInt(userId),
            postId: parseInt(postId),
        })
        if (responses.message === "The post have already been saved") {
            return res.status(409).json(responses)
        }

        if (responses.errorCode === 2) {
            return res.status(500).json(responses)
        }
        res.status(200).json(responses)
    } catch (error) {
        console.log(`Error at handleSavePost: ${error.message}`)
        res.status(500).json({ Error: error, message: "Internal Server Error" })
    }
}

/**UPDATE */
export const handleGetSavedPostsByUserId = async (req, res) => {
    const userId = req.query.userId
    try {
        const responses = await getSavedPostsByUserId(userId)
        if (responses.errorCode === 2) {
            return res.status(500).json(responses)
        }
        res.status(200).json(responses)
    } catch (error) {
        console.log(`Error at handleGetSavedPostsByUserId: ${error.message}`)
        res.status(500).json({ Error: error, message: "Internal Server Error" })
    }
}
export const handleGetFollowing = async (req, res) => {
    const { userId } = req.body
    try {
        const responses = await getAllFollowing(userId)
        res.status(200).json(responses)
    } catch (error) {
        console.log(`Error at handleGetFollowing: ${error.message}`)
        res.status(500).json({ Error: error, message: "Internal Server Error" })
    }
}

export const handleGetFollowers = async (req, res) => {
    const { userId } = req.body

    try {
        const responses = await getAllFollowers(userId)
        res.status(200).json(responses)
    } catch (error) {
        console.log(`Error at handleGetFollowers: ${error.message}`)
        res.status(500).json({ Error: error, message: "Internal Server Error" })
    }
}

export const handleAddRelationship = async (req, res) => {
    const userId = req.params.id
    const otherUserId = req.query.otherUserId
    try {
        const responses = await addRelationShip(userId, otherUserId)
        if (responses.message === "already followed") {
            return res.status(409).json(responses)
        }

        if (responses.errorCode === 2) {
            return res.status(500).json(responses)
        }

        res.status(200).json(responses)
    } catch (error) {
        console.log(`Error at handleAddRelationship: ${error.message}`)
        res.status(500).json({ Error: error, message: "Internal Server Error" })
    }
}

export const handleUpdateUser = async (req, res, next) => {
    const id = req.params.id
    const updatedInformation = req.body
    try {
        const responses = await updateUser({ id, updatedInformation })
        if (!responses.user && responses.errorCode === 1) {
            res.status(404).json(responses)
            return
        }

        if (responses.errorCode === "CONFLICT") {
            return res.status(409).json({ message: responses.message })
        }
        if (responses.errorCode === 2) {
            res.status(500).json(responses)
            return
        }
        res.status(200).json(responses)
    } catch (error) {
        console.log(`Error at handleUpdateUser: ${error.message}`)
        res.status(500).json({ Error: error, message: "Internal Server Error" })
    }
}

export const handleUpdateAvatar = async (req, res, next) => {
    console.log("run")
    const avatarUrl = req.files[0].path
    const userId = req.params.id
    try {
        const responses = await updateAvatar({ userId, avatarUrl })
        if (!responses.user && responses.errorCode === 1) {
            cloudinary.uploader.destroy(req.file.filename)
            res.status(404).json(responses)
            return
        }
        if (responses.errorCode === 2) {
            res.status(500).json(responses)
            return
        }
        res.status(200).json(responses)
    } catch (error) {
        console.log(`Error at handleAddAvatar: ${error.message}`)
        res.status(500).json({ Error: error, message: "Internal Server Error" })
    }
}

export const handleUpdatePassword = async (req, res) => {
    const { password, newPassword } = req.body
    const userId = req.params.id
    try {
        const passwordCorrect = await verifyPassword({ password, userId })
        if (passwordCorrect.errorCode === 2) {
            res.status(500).json(passwordCorrect)
            return
        }
        if (!passwordCorrect) {
            res.status(401).json({ message: "Wrong password!" })
            return
        }
        const responses = await updatePassword({
            password: newPassword,
            userId,
        })
        if (responses.errorCode === 2) {
            res.status(500).json(responses)
            return
        }
        res.status(200).json(responses)
    } catch (error) {
        console.log(`Error at handleUpdatePassword: ${error.message}`)
        res.status(500).json({ Error: error, message: "Internal Server Error" })
    }
}

export const handleGetUserById = async (req, res) => {
    const id = req.params.id
    try {
        const responses = await getUserById(id)
        if (responses.message === "USER NOT FOUND") {
            return res.status(404).json(responses)
        }
        res.status(200).json(responses)
    } catch (error) {
        console.log(`Error at handleGetUserById: ${error.message}`)
        res.status(500).json({ Error: error, message: "Internal Server Error" })
    }
}

export const handleUpdateStatus = async (req, res) => {
    const userId = req.params.id
    try {
        const responses = await updateStatus(userId)
        if (responses.errorCode === 2) {
            return res.status(500).json(responses)
        }
        res.status(200).json(responses)
    } catch (error) {
        console.log(`Error at handleUpdateStatus: ${error.message}`)
        res.status(500).json({ Error: error, message: "Internal Server Error" })
    }
}

/**DELETE */
export const handleRemoveRelationShip = async (req, res) => {
    const userId = req.params.id
    const otherUserId = req.query.otherUserId
    try {
        const responses = await removeRelationShip(userId, otherUserId)
        if (responses.message === "RELATIONSHIP NOT FOUND") {
            return res.status(404).json(responses)
        }
        if (responses.errorCode === 2) {
            return res.status(500).json(responses)
        }
        res.status(200).json(responses)
    } catch (error) {
        console.log(`Error at handleUpdateStatus: ${error.message}`)
        res.status(500).json({ Error: error, message: "Internal Server Error" })
    }
}

export const handleDeleteSavedPost = async (req, res) => {
    const { userId, postId } = req.query
    try {
        const responses = await deleteSavedPost({ userId, postId })
        if (responses.message === "SAVED POST NOT FOUND") {
            return res.status(404).json(responses)
        }
        if (responses.errorCode === 2) {
            return res.status(500).json(responses)
        }
        res.status(200).json(responses)
    } catch (error) {
        console.log(`Error at handleDeleteSavedPost: ${error.message}`)
        res.status(500).json({ Error: error, message: "Internal Server Error" })
    }
}
