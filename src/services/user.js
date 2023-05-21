import db from "../models/index"
import bcrypt from "bcrypt"
import { Op } from "sequelize"

/**CREATE */
export const savePost = async ({ userId, postId }) => {
    const newSavedPost = { user_id: userId, post_id: postId }
    try {
        const savedPost = await db.SavedPosts.create(newSavedPost)

        return {
            savdPost: savedPost,
            errorCode: 0,
            message: "Save post successfully",
        }
    } catch (error) {
        return {
            errorCode: 2,
            message: error.message,
        }
    }
}
export const getAllFollowing = async (userId) => {
    try {
        const followingId = await db.Relationships.findAll({
            attributes: ["followingUser"],
            where: {
                follower: userId,
            },
        })

        if (!followingId)
            return {
                following: [],
                errorCode: 0,
                message: "ok",
            }

        const followingUsernames = await Promise.all(
            followingId.map(async (item) => {
                try {
                    const id = item.dataValues.followingUser

                    const response = await db.Users.findOne({
                        attributes: ["userName"],
                        where: {
                            id: id,
                        },
                    })
                    return response.dataValues.userName
                } catch (error) {
                    return error.message
                }
            })
        )

        return {
            following: followingUsernames,
            errorCode: 0,
            message: "ok",
        }
    } catch (error) {
        return {
            following: "fail to load",
            errorCode: 0,
            message: error.message,
        }
    }
}

export const getAllFollowers = async (userId) => {
    try {
        const followerId = await db.Relationships.findAll({
            attributes: ["follower"],
            where: {
                followingUser: userId,
            },
        })

        if (!followerId)
            return {
                followers: [],
                errorCode: 0,
                message: "ok",
            }

        const followerNames = await Promise.all(
            followerId.map(async (userId) => {
                const id = userId.dataValues.follower
                const response = await db.Users.findOne({
                    attributes: ["userName"],
                    where: {
                        id: id,
                    },
                })
                return response.dataValues.userName
            })
        )

        return {
            followers: followerNames,
            errorCode: 0,
            message: "ok",
        }
    } catch (error) {
        return {
            followers: "fail to load",
            errorCode: 1,
            message: error.message,
        }
    }
}

export const updateUser = async ({ id, updatedInformation }) => {
    try {
        const user = await db.Users.findByPk(id)
        if (!user) {
            return {
                errorCode: 1,
                message: "User not found",
            }
        }

        await db.Users.update(updatedInformation, {
            where: {
                id: id,
            },
        })

        const updatedUser = await db.Users.findByPk(id, {
            attributes: {
                exclude: ["password"],
            },
            include: [
                {
                    model: db.Posts,
                    as: "savedPosts",
                    include: {
                        model: db.Images,
                        as: "images",
                    },
                },
                {
                    model: db.Posts,
                    as: "posts",
                    include: {
                        model: db.Images,
                        as: "images",
                    },
                },
            ],
        })

        return {
            user: updatedUser,
            errorCode: 0,
            message: "Update user successfully!",
        }
    } catch (error) {
        return {
            errorCode: 2,
            message: error.message,
        }
    }
}

export const updateAvatar = async ({ userId, avatarUrl }) => {
    const id = userId
    try {
        const user = await db.Users.findByPk(id)
        if (!user) {
            return {
                errorCode: 1,
                message: "User not found",
            }
        }
        //
        await db.Users.update(
            { avatar: avatarUrl },
            {
                where: {
                    id: id,
                },
            }
        )
        //
        const updatedUser = await db.Users.findByPk(id, {
            attributes: {
                exclude: ["password"],
            },
            include: [
                {
                    model: db.Posts,
                    as: "savedPosts",
                    include: {
                        model: db.Images,
                        as: "images",
                    },
                },
                {
                    model: db.Posts,
                    as: "posts",
                    include: {
                        model: db.Images,
                        as: "images",
                    },
                },
            ],
        })
        return {
            user: updatedUser,
            errorCode: 0,
            message: "Update avatar successfully!",
        }
    } catch (error) {
        return {
            errorCode: 2,
            message: error.message,
        }
    }
}

export const verifyPassword = async ({ password, userId }) => {
    try {
        const user = await db.Users.findOne({
            where: {
                id: userId,
            },
        })
        const match = await bcrypt.compare(password, user.password)
        return match
    } catch (error) {
        return {
            errorCode: 2,
            message: error.message,
        }
    }
}

export const updatePassword = async ({ password, userId }) => {
    try {
        await db.Users.update(
            { password: password },
            {
                where: {
                    id: userId,
                },
            }
        )

        return {
            errorCode: 0,
            message: "Update password successfully!",
        }
    } catch (error) {
        return {
            errorCode: 2,
            message: error.message,
        }
    }
}

export const getUserById = async (id) => {
    try {
        const user = await db.Users.findByPk(id, {
            attributes: {
                exclude: ["password"],
            },
            include: {
                model: db.Posts,
                as: "posts",
                include: {
                    model: db.Images,
                    as: "images",
                },
            },
        })
        if (!user) {
            return {
                message: "USER NOT FOUND",
            }
        }
        return {
            user: user,
            errorCode: 0,
            message: "Get user successfully!",
        }
    } catch (error) {
        return {
            errorCode: 2,
            message: error.message,
        }
    }
}

export const updateStatus = async (userId) => {
    try {
        await db.Users.update(
            { isOnline: 1 },
            {
                where: {
                    id: userId,
                },
            }
        )

        const user = await db.Users.findByPk(userId, {
            attributes: ["isOnline"],
        })

        return {
            isUserOnline: user.dataValues.isOnline,
            message: "Update user status successfully!",
        }
    } catch (error) {
        return {
            errorCode: 2,
            message: error.message,
        }
    }
}

export const addRelationShip = async (userId, otherUserId) => {
    const newRelationship = { follower: userId, followedUser: otherUserId }
    console.log(newRelationship)
    try {
        const checkRelationship = await db.Relationships.findOne({
            where: {
                [Op.and]: [{ follower: userId }, { followedUser: otherUserId }],
            },
        })

        if (checkRelationship) {
            return {
                relationship: checkRelationship,
                message: "already followed",
            }
        }

        const relationship = await db.Relationships.create(newRelationship)
        return {
            relationship: relationship,
            message: "Add relationship successfully!",
        }
    } catch (error) {
        return {
            errorCode: 2,
            message: error.message,
        }
    }
}

export const removeRelationShip = async (userId, otherUserId) => {
    try {
        const checkRelationship = await db.Relationships.destroy({
            where: {
                [Op.and]: [{ follower: userId }, { followedUser: otherUserId }],
            },
        })

        if (!checkRelationship) {
            return {
                errorCode: 1,
                message: "RELATIONSHIP NOT FOUND",
            }
        }

        return {
            errorCode: 0,
            message: "unfollow successfully!",
        }
    } catch (error) {
        return {
            errorCode: 2,
            message: error.message,
        }
    }
}
