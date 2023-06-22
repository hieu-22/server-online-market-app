import db from "../db/models/index"
import jwt from "jsonwebtoken"
import { login } from "../services/auth"

export const handleRegister = async (req, res) => {
    try {
        const { userAccount, password } = req.body
        const defaultUserName = userAccount.split("@")[0]
        const newUser = {
            email: userAccount,
            password: password,
            userName: defaultUserName,
        }
        const checkUserExisted = await db.Users.findOne({
            where: {
                email: userAccount,
            },
        })
        if (checkUserExisted) {
            res.status(409).json({
                message: "User already existed, please try another!",
            })
            return
        }

        // insert user to database
        await db.Users.create(newUser)

        const user = await db.Users.findOne({
            attributes: { exclude: ["password"] },
            where: {
                email: userAccount,
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

        // token
        const { id, email, userName } = user
        const tokenPayload = { id, email, userName }
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
            expiresIn: "24h",
        })

        res.status(201).json({
            user: user,
            token,
            message: "Register successfully!",
        })
    } catch (error) {
        return res
            .status(500)
            .json({ error: error.message, message: "Internal Server Error" })
    }
}

export const handleLogin = async (req, res) => {
    try {
        const { userAccount, password } = req.body

        const responses = await login({ userAccount, password })
        if (responses.message === "NOT FOUND") {
            return res.status(404).json(responses)
        }

        if (responses.message === "WRONG PASSWORD") {
            return res.status(401).json(responses)
        }

        if (responses.errorCode === 2) {
            return res.status(500).json(responses)
        }

        res.status(200).json(responses)
    } catch (error) {
        console.log(`Error at handleLogin: ${error.message}`)
        res.status(500).json({ Error: error, message: "Internal Server Error" })
    }
}
