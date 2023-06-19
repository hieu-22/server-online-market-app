import express from "express"
import cors from "cors"
const app = express()

const allowOrigins = [
    "http://localhost:3000",
    undefined,
    "https://emarket-client-omega.vercel.app",
]

export const corsOptions = {
    origin: function (origin, callback) {
        if (allowOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
}
