import db from "../models/index"
import jwt from "jsonwebtoken"
import { Op } from "sequelize"
import bcrypt from "bcrypt"
import { login } from "../services/auth"

export const handleRegister = async (req, res) => {
    try {
        const { userAccount, password } = req.body
        const userName = userAccount.split("@")[0]
        const newUser = {
            email: userAccount,
            password: password,
            userName: userName,
        }
        const checkUserExisted = await db.Users.findOne({
            where: {
                [Op.or]: {
                    email: userAccount,
                    phoneNumber: userAccount,
                },
            },
        })
        if (checkUserExisted) {
            res.status(200).json({
                message: "User already existed, please try another!",
            })
            return
        }

        // insert user to database
        await db.Users.create(newUser)

        const user = await db.Users.findOne({
            attributes: { exclude: ["password", "createdAt", "updatedAt"] },
            where: {
                [Op.or]: {
                    email: userAccount,
                    phoneNumber: userAccount,
                },
            },
        })

        // token
        const token = jwt.sign({ ...user }, process.env.JWT_SECRET_KEY, {
            expiresIn: "24h",
        })

        res.status(201).json({
            user: user,
            token,
            message: "Register successfully!",
        })
    } catch (error) {
        return res.status(500).json({ error: error.message })
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
