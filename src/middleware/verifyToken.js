import jwt from "jsonwebtoken"

export const verifyToken = async (req, res, next) => {
    const token = req.headers.token
    if (!token)
        return res.status(401).json({ message: "You are not authenticated" })

    // console.log("==> token: ", token)
    const accessToken = token.split(" ")[1]
    jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            res.status(403).json({ message: "token is not valid" })
            return
        }
        req.user = user
        next()
    })
}
