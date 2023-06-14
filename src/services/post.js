import db from "../models/index"
import { myCloudinary as cloudinary } from "../middleware/cloudinaryUploader"
import sequelize, { Op } from "sequelize"

const extractPublicIdFromUrl = (url) => {
    const publicId = url
        .split("/")
        .splice(7)
        .join("/")
        .split(".")[0]
        .replace("%20", " ")
    return publicId
}

/**CREATE */
/**READ */
export const getPostsByUserId = async ({ user_id }) => {
    try {
        const response = await db.Posts.findAll({
            where: {
                user_id: user_id,
            },
            order: [["createdAt", "DESC"]],
            include: [{ model: db.Images, as: "images" }],
        })
        return {
            posts: response,
            errorCode: 0,
            message: "ok",
        }
    } catch (error) {
        return {
            errorCode: 2,
            message: error.message,
        }
    }
}

export const searchForPostsAndUsers = async ({ searchKey, searchWords }) => {
    try {
        const results = await Promise.all([
            db.Users.findAll({
                where: {
                    [Op.or]: [
                        {
                            userName: {
                                [Op.regexp]: `(^|\\s)(${searchKey}|${searchKey.replace(
                                    /\s/g,
                                    "|"
                                )})($|\\s)`,
                            },
                        },
                        {
                            introduction: {
                                [Op.regexp]: `(^|\\s)(${searchKey}|${searchKey.replace(
                                    /\s/g,
                                    "|"
                                )})($|\\s)`,
                            },
                        },
                    ],
                },
                collate: "utf8_general_ci",
            }),

            db.Posts.findAll({
                where: {
                    [Op.or]: [
                        {
                            title: {
                                [Op.regexp]: `(^|\\s)(${searchKey}|${searchKey.replace(
                                    /\s/g,
                                    "|"
                                )})($|\\s)`,
                            },
                        },
                        {
                            description: {
                                [Op.regexp]: `(^|\\s)(${searchKey}|${searchKey.replace(
                                    /\s/g,
                                    "|"
                                )})($|\\s)`,
                            },
                        },
                    ],
                },
                include: [
                    { model: db.Users, as: "author" },
                    { model: db.Images, as: "images" },
                ],
                collate: "utf8_general_ci",
                order: [
                    [
                        sequelize.literal(
                            "CASE WHEN title LIKE '%" +
                                searchKey +
                                "%' THEN 1 ELSE 0 END"
                        ),
                        "DESC",
                    ],
                    [
                        sequelize.literal(
                            "CASE WHEN description LIKE '%" +
                                searchKey +
                                "%' THEN 1 ELSE 0 END"
                        ),
                        "DESC",
                    ],
                    [
                        sequelize.literal(
                            "CASE WHEN title LIKE '%" +
                                searchWords.join("%") +
                                "%' THEN 1 ELSE 0 END"
                        ),
                        "DESC",
                    ],
                    [
                        sequelize.literal(
                            "CASE WHEN description LIKE '%" +
                                searchWords.join("%") +
                                "%' THEN 1 ELSE 0 END"
                        ),
                        "DESC",
                    ],
                ],
            }),
        ])
        const searchResult = {
            users: results[0],
            posts: results[1],
        }

        return {
            searchResult: searchResult,
            message: "OK",
        }
    } catch (error) {
        return {
            errorCode: 2,
            message: error.message,
        }
    }
}

/**UPDATE */
/**DELETE */

export const getPosts = async ({ limit }) => {
    try {
        const response = await db.Posts.findAll({
            order: [["createdAt", "DESC"]],
            limit: limit,
            include: [
                { model: db.Images, as: "images" },
                { model: db.Users, as: "author" },
            ],
        })

        return {
            posts: response,
            errorCode: 0,
            message: "ok",
        }
    } catch (error) {
        return {
            errorCode: 2,
            message: error.message,
        }
    }
}

export const getNextPosts = async ({ limit, lastPostCreatedAt }) => {
    try {
        const response = await db.Posts.findAll({
            where: {
                createdAt: { [Op.lt]: lastPostCreatedAt },
            },
            order: [["createdAt", "DESC"]],
            limit: limit,
            include: [
                { model: db.Images, as: "images" },
                { model: db.Users, as: "author" },
            ],
        })

        return {
            posts: response,
            errorCode: 0,
            message: "ok",
        }
    } catch (error) {
        return {
            errorCode: 2,
            message: error.message,
        }
    }
}

export const addPost = async (newPost) => {
    try {
        const post = await db.Posts.create(newPost)
        return post
    } catch (error) {
        return {
            post: "Fail to create post",
            errorCode: 2,
            message: error,
        }
    }
}

export const getPostByUrl = async (post_url) => {
    try {
        const post = await db.Posts.findOne({
            where: {
                post_url: post_url,
            },
            include: [
                {
                    model: db.Images,
                    as: "images",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "post_id"],
                    },
                },
                {
                    model: db.Users,
                    as: "author",
                    attributes: { exclude: ["password"] },
                },
            ],
        })

        if (!post) {
            return {
                errorCode: 1,
                message: "Post has not found",
            }
        }

        return {
            post,
            errorCode: 0,
            message: "OK",
        }
    } catch (error) {
        return {
            post: "Fail to get post",
            errorCode: 2,
            message: error.message,
        }
    }
}

export const addImageUrl = async ({ images, postId }) => {
    try {
        const imageUrlsinstances = await Promise.all(
            images.map((image) => {
                const imageUrl = image.path
                return {
                    imageUrl,
                    post_id: postId,
                }
            })
        )
        const savedImages = await db.Images.bulkCreate(imageUrlsinstances)
        const imagesUrls = await savedImages.map((image) => {
            const imageUrl = image.dataValues.imageUrl
            return imageUrl
        })

        return imagesUrls
    } catch (error) {
        return {
            imagesUrls: "Fail to create imagesUrls",
            errorCode: 1,
            message: error.message,
        }
    }
}

export const getImageUrl = async (postId) => {
    try {
        const imageUrlsInstances = await db.Images.findAll({
            attributes: ["imageUrl"],
            where: {
                post_id: postId,
            },
        })

        if (!imageUrlsInstances) {
            return {
                message:
                    "The post doesn't have any images or Images has been deleted",
            }
        }

        const imageUrls = imageUrlsInstances.map((image) => {
            return image.dataValues.imageUrl
        })

        return imageUrls
    } catch (error) {
        return {
            imagesUrls: "Fail to get Images",
            errorCode: 1,
            message: error.message,
        }
    }
}

export const updatePost = async ({ newPost, images, postId }) => {
    try {
        // 1. updating post's images
        const idHavingReqImages = images.filter(
            (image) => image.id !== undefined
        )
        console.log("=> idHavingReqImages: ", idHavingReqImages)
        const idNonHavingReqImages = images.filter(
            (image) => image.id === undefined
        )
        console.log("=> idNonHavingReqImages: ", idNonHavingReqImages)

        const dbSavedimages = await db.Images.findAll({
            where: {
                post_id: postId,
            },
        })

        // - To skip the database images if it's existed in request updated images into database
        // - to destroy images that exist in old database but not existed in request updated images
        await dbSavedimages.forEach(async (image) => {
            const index = idHavingReqImages.findIndex(
                (chekingImage) => chekingImage.id === image.id
            )
            if (index === -1) {
                const deletedRows = await db.Images.destroy({
                    where: {
                        id: image.id,
                    },
                })
                console.log("deleted database : ", deletedRows)
            }
        })

        // - to add images that new to the database
        await idNonHavingReqImages.forEach(async (image) => {
            const createdRows = await db.Images.create({
                imageUrl: image.imageUrl,
                post_id: postId,
            })
        })

        // 2. updating post
        const res = await db.Posts.update(newPost, {
            where: {
                id: postId,
            },
        })

        return {
            errorCode: 0,
            message: "Update post successfully!",
        }
    } catch (error) {
        return {
            errorCode: 2,
            message: error.message,
        }
    }
}

export const deletePost = async ({ userId, postId }) => {
    try {
        const postImages = await db.Images.findAll({
            where: {
                post_id: postId,
            },
        })
        // console.log(">>> postImages: ", postImages)
        // -Delete images on cloudinary
        if (postImages) {
            const imagePublicIds = await Promise.all(
                postImages.map(async (image) => {
                    const publicId = await extractPublicIdFromUrl(
                        image.dataValues.imageUrl
                    )
                    return publicId
                })
            )
            const { deleted } = cloudinary.api.delete_resources(imagePublicIds)
            console.log(">>> cloudinary deleting result: ", deleted)
        }

        const deletedImagesRows = await db.Images.destroy({
            where: {
                post_id: postId,
            },
        })
        // console.log(">>> deletedImagesRows: ", deletedImagesRows)

        const deletedPostsRows = await db.Posts.destroy({
            where: {
                id: postId,
            },
        })

        if (deletedPostsRows === 0) {
            return {
                errorCode: 1,
                message: "NOT FOUND",
            }
        }

        const updatedPosts = await db.Posts.findAll({
            where: {
                user_id: userId,
            },
            include: {
                model: db.Images,
                as: "images",
            },
        })
        // console.log(">>> deletedPostsRows: ", deletedPostsRows)
        return {
            posts: updatedPosts,
            message: "Delete post successfully!",
        }
    } catch (error) {
        return {
            errorCode: 2,
            message: "Fail to delete post",
            errorMessage: error.message,
        }
    }
}
