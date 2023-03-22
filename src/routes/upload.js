import express from "express"

const router = express.Router()
import { upload } from "../config/uploadConfig"

// routes
router.post("/", upload.single("file"), (req, res) => {
    try {
        const imageUrl = req.file
        // res.status(201).json({
        //     imageUrl: imageUrl,
        //     message: "Image uploaded on cloudinary",
        // })
        res.send(`<img src=${imageUrl.path}/>`)
    } catch (error) {
        res.status(500).json(error)
    }
})

export default router
