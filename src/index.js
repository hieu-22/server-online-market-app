import express from "express"
import commonConfig from "./config/commonConfig"
import auth from "./routes/auth"
import upload from "./routes/upload"
import connectDB from "./config/connectDB"

/**Configurations */
const app = express()
commonConfig(app)

const PORT = process.env.PORT || 5001

/**Connect to database */
connectDB()

/**Routes */
app.use("/api", auth)
app.use("/upload", upload)

/**App listening */
app.listen(PORT, () => {
    console.log("App running on port", PORT)
})
