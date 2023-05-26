import { Server } from "socket.io"
const activeConnections = new Set()
import { addMessage } from "../services/conversation"

const applyWebSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
        },
    })
    io.on("connection", (socket) => {
        activeConnections.add(socket)
        console.log("=> Connected: ", socket.id)

        socket.on("disconnect", (reason) => {
            console.log(`=> Disconnected: ${socket.id}`)
        })
        socket.on("addMessage", async (newMessage, getMessage) => {
            console.log(newMessage)
            // getMessage(response)
            try {
                const response = await addMessage(newMessage)
                if (response.errorCode === 2) {
                    return getMessage(response)
                }
                getMessage(null, response)
            } catch (error) {
                getMessage(error)
            }
        })
    })
    return io
}

export default applyWebSocket
