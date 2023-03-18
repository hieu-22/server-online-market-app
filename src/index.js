import express from "express"
import commonConfiguration from "./config/commonConfiguration"
import userRoutes from "./routes/userRoutes"
import connectDB from "./config/connectDB"

/**Configurations */
const app = express()
commonConfiguration(app)
const PORT = process.env.PORT || 5001

/**Connect to database */
connectDB()

/**Routes */
app.use("/", userRoutes)

/**App listening */
app.listen(PORT, () => {
    console.log("App running on port", PORT)
})
