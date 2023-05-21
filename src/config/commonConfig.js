import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import { corsOptions } from "./allowOrigin"
const commonConfig = (app) => {
    dotenv.config()

    app.use(express.json())
    app.use(morgan("common"))
    app.use(bodyParser.json({ limit: "30mb", extended: true }))
    app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
    app.use(cors(corsOptions))
    app.use(cookieParser())
}

export default commonConfig
