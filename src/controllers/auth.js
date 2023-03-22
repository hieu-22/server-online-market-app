import db from "../models/index"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    try {
        const { userAccount, password, address } = req.body

        // hash password
        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(password, salt)

        // insert user to database
        const user = await db.User.create({
            userAccount,
            password: hashPassword,
            phoneNumber,
            address,
        })

        // token

        return res
            .status(201)
            .json({ data: user, message: "Register successfully!" })
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const handleLogin = async (req, res) => {
    const { userAccount, password } = req.body

    // check user in db
    const user = db.User.findOne({
        where: {
            userAccount: userAccount,
        },
    })
    if (!user) res.status(404).json({ message: "User not found" })

    // check password
    const match = await bcrypt.compare(password, user.password)
    if (!match) res.status(404).json({ message: "Wrong password" })

    user.password = undefined
    const token = jwt.sign({ ...user }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
    })

    res.status(200).json({
        user: user,
        token,
    })
}
