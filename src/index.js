import express from "express"
import commonConfig from "./config/commonConfig"
import auth from "./routes/auth"
import connectDB from "./config/connectDB"
import user from "./routes/user"
import post from "./routes/post"
import conversation from "./routes/conversation"

/**Configurations */
const app = express()
commonConfig(app)

const PORT = process.env.PORT || 5001

/**Connect to database */
connectDB()

/**Routes */
app.use("/api", auth)
app.use("/api", user)
app.use("/api", post)
app.use("/api", conversation)

/**App listening */
app.listen(PORT, () => {
    console.log("App running on port", PORT)
})
