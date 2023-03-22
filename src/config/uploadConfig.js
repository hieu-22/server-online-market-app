import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"

import dotenv from "dotenv"

const uuid = require("uuid").v4
const cloudinary = require("cloudinary").v2

dotenv.config()

cloudinary.config({
    cloud_name: process.env.STORAGE_NAME,
    api_key: process.env.STORAGE_API_KEY,
    api_secret: process.env.STORAGE_API_SECRET,
    secure: true,
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "pictures",
        allowed_formats: ["jpg", "jpeg", "png"],
        // public_id: (req, file) => `images-${uuid()}`,
        use_filename: true,
        unique_filename: true,
    },
})

// Set up the route for handling file upload:
// app.post('/upload', upload.single('image'), (req, res) => {
//   res.json({ url: req.file.path });
// });

export const upload = multer({ storage: storage })
