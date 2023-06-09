import db from "../models/index"
import bcrypt from "bcrypt"
import { Op } from "sequelize"
import jwt from "jsonwebtoken"

export const login = async ({ userAccount, password }) => {
    try {
        // check user in db
        const checkingUser = await db.Users.findOne({
            where: {
                email: userAccount,
            },
        })

        if (!checkingUser) {
            return { errorCode: 1, message: "NOT FOUND" }
        }

        // check password
        const plainTextPassword = password
        const hashPassword = checkingUser.password
        // console.log(">>> hashPassword: ", hashPassword)
        const isMatch = bcrypt.compareSync(plainTextPassword, hashPassword)
        if (!isMatch) {
            return { errorCode: 1, message: "WRONG PASSWORD" }
        }

        const user = await db.Users.findByPk(checkingUser.dataValues.id, {
            attributes: {
                exclude: ["password"],
            },
            include: [
                {
                    model: db.Posts,
                    as: "posts",
                    include: {
                        model: db.Images,
                        as: "images",
                    },
                },
                {
                    model: db.Relationships,
                    as: "followers",
                    attributes: ["follower"],
                    include: {
                        model: db.Users,
                        as: "followerInfo",
                    },
                },
                {
                    model: db.Relationships,
                    as: "followingUsers",
                    attributes: ["followedUser"],
                    include: {
                        model: db.Users,
                        as: "followedUserInfo",
                    },
                },
            ],
        })

        const { id, email, userName } = user
        const tokenPayload = { id, email, userName }
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
            expiresIn: "24h",
        })

        return {
            user: user,
            token,
            message: "Login successfully!",
        }
    } catch (error) {
        return {
            errorCode: 2,
            message: error.message,
        }
    }
}
