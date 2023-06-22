import express from "express"
import { createServer } from "http"
import commonConfig from "./config/commonConfig"
import applyWebSocket from "./config/websocket"
import auth from "./routes/auth"
import user from "./routes/user"
import post from "./routes/post"
import conversation from "./routes/conversation"
import { send } from "process"

/**Configurations */
const app = express()
commonConfig(app)
const PORT = process.env.PORT || 5001
const server = createServer(app)
/**Routes */
app.use("/api", auth)
app.use("/api", user)
app.use("/api", post)
app.use("/api", conversation)
app.get("/", (req, res) => {
    res.send(
        "<h1 style='color:rgb(74 74 74)'>Click <a href='https://www.postman.com/maintenance-saganist-21460907/workspace/nmhieu191/documentation/25292509-97a03a47-f4a0-4cdb-9dc3-94e6f1a8bb1c'>API Routes<a/> for more information</h1> "
    )
})

/**WEBSOCKET */
applyWebSocket(server)

/**App listening */
server.listen(PORT, () => {
    console.log("App running on port", PORT)
})
