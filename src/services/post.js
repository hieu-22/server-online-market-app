import db from "../models/index"
import { myCloudinary as cloudinary } from "../middleware/cloudinaryUploader"
import { Op } from "sequelize"

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

export const searchPosts = async ({ searchKeys }) => {
    try {
        const response = await db.Posts.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${searchKeys}%` } },
                    {
                        description: {
                            [Op.like]: `%${searchKeys}%`,
                        },
                    },
                ],
            },
        })

        return {
            matchedPosts: response,
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
            include: {
                model: db.Users,
                as: "author",
                attributes: { exclude: ["password"] },
            },
        })

        if (!post) {
            return {
                errorCode: 1,
                message: "Post has not found",
            }
        }

        return post
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
        console.log(savedImages)
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

export const updatePost = async (newPost, images, postId, imageIds) => {
    const images_Ids = Array.isArray(imageIds) ? imageIds : [imageIds]
    console.log("imageIds ", imageIds)
    try {
        await db.Posts.update(newPost, {
            where: {
                id: postId,
            },
        })

        // updatedPost
        const updatedPost = await db.Posts.findByPk(postId, {
            attributes: {
                exclude: ["createdAt"],
            },
        })

        if (images) {
            const updatedImages = await Promise.all(
                images.map(async (image, index) => {
                    const oldImage = await db.Images.findByPk(images_Ids[index])
                    if (!oldImage) {
                        return {
                            message: "Image not found ",
                        }
                    }

                    const publicId = extractPublicIdFromUrl(
                        oldImage.dataValues.imageUrl
                    )

                    const { result } = await cloudinary.uploader.destroy(
                        publicId,
                        {}
                    )
                    console.log("result >>>", result)
                    await db.Images.update(
                        {
                            imageUrl: image.path,
                        },
                        {
                            where: {
                                id: images_Ids[index],
                            },
                        }
                    )

                    return {
                        id: oldImage.id,
                        imageUrl: image.path,
                    }
                })
            )

            return {
                post: updatedPost,
                images: updatedImages,
                errorCode: 0,
                message: "Update post successfully!",
            }
        }

        return {
            post: updatedPost,
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

export const deletePost = async (postId) => {
    try {
        const postImages = await db.Images.findAll({
            where: {
                post_id: postId,
            },
        })
        console.log(">>> postImages: ", postImages)
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
        console.log(">>> deletedImagesRows: ", deletedImagesRows)

        const deletedPostsRows = await db.Posts.destroy({
            where: {
                id: postId,
            },
        })
        console.log(">>> deletedPostsRows: ", deletedPostsRows)
        return {
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
