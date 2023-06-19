import { Server } from "socket.io"
import {
    addMessage,
    getConversationByUserId,
    getChatById,
    hideMessageByOwner,
    hideMessageByAnother,
    deleteMessageById,
    deleteChatByUserId,
    getMoreMessagesById,
    updateMessage,
    updateMessageReadByAnother,
} from "../services/conversation"
import {
    activateUserOnlineStatus,
    deactivateUserOnlineStatus,
} from "../services/user"

const applyWebSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: [process.env.URL_REACT],
        },
    })

    const activeSockets = new Map()
    io.on("connection", async (socket) => {
        // Authentication process
        // ...
        socket.on("disconnect", (reason) => {
            // console.log(`=> Disconnected: `, { id: socket.id }, reason)
            const userId = activeSockets.get(socket.id)
            if (userId) {
                const userIdRoom = io.sockets.adapter.rooms.get(userId)
                if (!userIdRoom) {
                    deactivateUserOnlineStatus(userId)
                }
                activeSockets.delete(socket.id)
            }
        })
        socket.on("activateUserOnlineStatus", async (userId) => {
            activeSockets.set(socket.id, userId)
            await socket.join(userId)
            activateUserOnlineStatus(userId)
            io.to(userId).emit("updateIsOnline")
            // console.log("connected activeSockets: ", activeSockets)
        })

        //CHAT FEATURES
        // -CHAT
        // -CHAT_CREATE
        socket.on("createChat", async ({ userId, postId }, getResponse) => {
            try {
                const data = await addConversationByPost({ userId, postId })
                getResponse(null, data.message)
                socket.emit("updateCreatedChat")
            } catch (error) {
                getResponse(error)
            }
        })
        // -CHAT_READ
        socket.on("getChatsByUserId", async ({ userId }, getChats) => {
            // -- initial data
            // filterChats to get the non hidden(which represent the chats or messages is hidden by the user) chats and messages
            const filterChats = async (chats) => {
                // 1. filter chats to get the nonHiddenChats
                // 2. filter to get non-hidden messsages of each the chats
                // 1.
                const nonHiddenChats = await Promise.all(
                    await chats.map(async (item) => {
                        // to check if the conversation is hidden
                        if (item.conversation.hid_user.length > 0) {
                            if (
                                item.conversation.hid_user.some(
                                    (user) => user.id === +userId
                                )
                            ) {
                                return undefined
                            }
                        }
                        return item.conversation
                    })
                )
                // to truncate empty array
                const truncatedChats = nonHiddenChats.filter(Boolean)

                // 2.
                await truncatedChats.forEach((chat) => {
                    chat.dataValues.messages = chat.messages.filter(
                        (message) =>
                            !(
                                (message.is_hidden_by_owner &&
                                    message.user_id === +userId) ||
                                (message.is_hidden_by_another &&
                                    message.user_id !== +userId)
                            )
                        // THIS CONDITION WOULD BE FALSE IF THE MESSAGE IS HIDDEN BY THE CURRENT USERS
                        // (is_hidden_by_owner & user_id is the current user id) || (is_hidden_by_another & user_id is NOT the current user id)
                    )
                })

                return truncatedChats
            }

            try {
                const response = await getConversationByUserId({
                    userId: +userId,
                })
                if (response.errorCode === 2) {
                    return getChats(response)
                }
                const chats = response.chats
                await chats.forEach((chat) => {
                    const chatId = chat.id
                    socket.join(`chat room ${chatId}`)
                })

                // sort the conversations by updatedAt ascendingly, (DIDN'T sort it in sequelize code because of nesting association structure reasons)
                const data = await filterChats(chats)
                data.sort((a, b) =>
                    new Date(b.updatedAt)
                        .toLocaleString()
                        .localeCompare(new Date(a.updatedAt).toLocaleString())
                )

                getChats(null, data)
            } catch (error) {
                getChats(error)
            }
        })
        // -CHAT_DELETE
        socket.on(
            "deleteChat",
            async ({ conversation_id, user_id }, getResponse) => {
                try {
                    const response = await deleteChatByUserId({
                        conversation_id,
                        user_id,
                    })
                    getResponse(null, response)
                } catch (error) {
                    getResponse(error)
                }
            }
        )
        // -MESSAGES
        socket.on(
            "addMessage",
            async (
                { user_id, content, conversation_id, otherUser_id },
                getMessage
            ) => {
                try {
                    const response = await addMessage({
                        user_id,
                        content,
                        conversation_id,
                    })
                    if (response.errorCode === 2) {
                        return getMessage(response)
                    }
                    getMessage(null, response.message)
                    io.to(`chat room ${conversation_id}`).emit(
                        "roomMessagesUpdated",
                        {
                            message: response.newMessage,
                            chatId: conversation_id,
                        }
                    )
                    io.to(`chat room ${conversation_id}`).emit(
                        "sendUpdatedChatId",
                        conversation_id
                    )
                } catch (error) {
                    getMessage(error)
                }
            }
        )
        // -MESSAGES_READ
        socket.on(
            "getChatById",
            async ({ conversationId, userId }, getMessages) => {
                try {
                    const response = await getChatById({
                        conversationId,
                        userId,
                    })
                    if (response.statusCode === 404) {
                        return getMessages(response)
                    }
                    if (response.statusCode === 403) {
                        return getMessages(response)
                    }
                    if (response.errorCode === 2) {
                        return getMessages(response)
                    }

                    getMessages(null, response)
                    const chatId = conversationId
                    socket.join(`chat room ${chatId}`)
                } catch (error) {
                    getMessages(error)
                }
            }
        )
        socket.on(
            "hideMessageByOwner",
            async ({ userId, messageId, conversationId }, getResponse) => {
                try {
                    const response = await hideMessageByOwner({
                        userId,
                        messageId,
                        conversationId,
                    })
                    if (response.errorCode === 2) {
                        return getResponse(response)
                    }
                    getResponse(null, response)
                } catch (error) {
                    getResponse(error)
                }
            }
        )
        socket.on(
            "hideMessageByAnother",
            async ({ userId, messageId }, getResponse) => {
                try {
                    const response = await hideMessageByAnother({
                        userId,
                        messageId,
                        conversationId,
                    })
                    if (response.errorCode === 2) {
                        return getResponse(response)
                    }
                    getResponse(null, response)
                } catch (error) {
                    getResponse(error)
                }
            }
        )
        socket.on(
            "deleteMessageById",
            async ({ userId, messageId, conversationId }, getResponse) => {
                try {
                    const response = await deleteMessageById({
                        userId,
                        messageId,
                        conversationId,
                    })
                    if (response.errorCode === 2) {
                        return getResponse(response)
                    }
                    io.to(`chat room ${conversationId}`).emit(
                        "updateDeletedMessage",
                        messageId
                    )
                    io.to(`chat room ${conversationId}`).emit(
                        "sendUpdatedChatId",
                        conversationId
                    )
                    getResponse(null, response)
                } catch (error) {
                    getResponse(error)
                }
            }
        )
        // to get more 10 messages of a chat
        socket.on(
            "getMoreMessages",
            async ({ chatId, offset }, getResponse) => {
                try {
                    const data = await getMoreMessagesById({
                        chatId,
                        offset,
                    })
                    if (data.errorCode === 2) {
                        return getResponse(data)
                    }
                    getResponse(null, data)
                } catch (error) {
                    getResponse(error)
                }
            }
        )
        // TO UPDATE MESSAGE IS READ
        socket.on(
            "updateMessageIsRead",
            async ({ userId, messageIds }, response) => {
                try {
                    await messageIds.forEach(async (id) => {
                        const res = await updateMessageReadByAnother(
                            { is_read_by_another: true },
                            id,
                            userId
                        )
                    })
                    response(null)
                } catch (error) {
                    response(error)
                }
            }
        )
    })
    return io
}

export default applyWebSocket
