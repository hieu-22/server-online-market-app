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
    res.send("Welcome!")
})

/**WEBSOCKET */
applyWebSocket(server)

/**App listening */
server.listen(PORT, () => {
    console.log("App running on port", PORT)
})
