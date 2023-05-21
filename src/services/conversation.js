import db from "../models/index"

/**CREATE */
export const addConversation = async ({ userId, postId }) => {
    try {
        // find Post and author to get author id
        const post = await db.Posts.findByPk(postId, {
            attributes: ["title", "user_id"],
        })
        if (!post) {
            return {
                errorCode: 1,
                message: "NOT FOUND",
            }
        }
        const newConversation = {
            title: post.dataValues.title,
            post_id: postId,
        }
        const postUserId = post.dataValues.user_id

        // create conversation
        const result = await db.Conversations.create(newConversation)
        // console.log("--- Creating result: ", result)
        const conversationId = result.dataValues.id

        // create user_conversation
        const newChatMembers = [
            { conversation_id: conversationId, user_id: userId },
            { conversation_id: conversationId, user_id: postUserId },
        ]
        const conversationMembers = await db.User_Conversation.bulkCreate(
            newChatMembers
        )

        const Chat = await db.Conversations.findByPk(conversationId, {
            include: [
                {
                    model: db.Users,
                    as: "chatMembers",
                    through: { attributes: [] },
                },
                {
                    model: db.Messages,
                    as: "messages",
                },
            ],
        })
        return {
            Chat: Chat,
            errorCode: 0,
            message: "Create conversation successfully!",
        }
    } catch (error) {
        console.log("ERROR at addConversation: ", error.message)
        return {
            errorCode: 2,
            message: "Failed to create!",
            errorMessage: error.message,
        }
    }
}

export const addMessage = async (newMessage) => {
    try {
        const message = await db.Messages.create(newMessage)
        // console.log(">>> created message: ", createdMessage.dataValues.id)
        const createdMessage = await db.Messages.findByPk(message.dataValues.id)

        return {
            messageData: createdMessage,
            errorCode: 0,
            message: "Ok",
        }
    } catch (error) {
        console.log("Error at addMessage: ", error.message)
        return {
            message: "Failed to create message",
            errorCode: 2,
            errorMessage: error.message,
        }
    }
}

/**READ */
export const getMessagesByConversationId = async (conversationId) => {
    try {
        const messages = await db.Messages.findAll({
            where: {
                conversation_id: conversationId,
            },
        })
        return {
            messages: messages,
            errorCode: 0,
            message: "Ok",
        }
    } catch (error) {
        return {
            message: "Failed to get messages",
            errorCode: 2,
            errorMessage: error.message,
        }
    }
}

export const getConversationByUserId = async (userId) => {
    try {
        const conversationIds = await db.User_Conversation.findAll({
            attributes: ["conversation_id"],
            where: {
                user_id: userId,
            },
        })

        const conversations = await Promise.all(
            conversationIds.map(async (id) => {
                const conversation = await db.Conversations.findByFk(id)
                console.log(">>> conversation: ", conversation)
                return conversation.dataValues
            })
        )
        console.log(">>> conversations: ", conversations)

        await conversations.forEach(async (conversation) => {
            const conversationId = conversation.dataValues.id
            const messages = await db.Messages.findAll({
                where: {
                    conversation_id: conversationId,
                },
            })
            conversation.messages = messages
        })
        console.log(">>> Editted conversations: ", conversations)
        return {
            conversations: conversations,
            errorCode: 0,
            message: "Ok",
        }
    } catch (error) {
        return {
            message: "Failed to get conversations",
            errorCode: 2,
            errorMessage: error.message,
        }
    }
}

/**UPDATE */
export const updateMessage = async (newMessage, messageId) => {
    try {
        // do update
        const updateResult = await db.Messages.update(newMessage, {
            where: {
                id: messageId,
            },
        })
        console.log(">>> Update result: ", updateResult)

        // get updated mesage
        const message = await db.Messages.findOne({
            where: {
                id: messageId,
            },
        })

        return {
            messageData: message.get(),
            errorCode: 0,
            message: "Ok",
        }
    } catch (error) {
        console.log("Error at addMessage: ", error.message)
        return {
            message: "Failed to update message",
            errorCode: 2,
            errorMessage: error.message,
        }
    }
}

/**DELETE */
export const deleteMessage = async (messageId) => {
    try {
        const deletingResult = await db.Messages.destroy({
            where: {
                id: messageId,
            },
        })
        console.log(">>> Deleting Result", deletingResult)

        return {
            message: "Delete message successfully!",
            errorCode: 0,
        }
    } catch (error) {
        console.log("Error at deleteMessage: ", error.message)
        return {
            message: "Failed to delte message",
            errorCode: 2,
            errorMessage: error.message,
        }
    }
}
