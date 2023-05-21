import {
    getMessagesByConversationId,
    getConversationByUserId,
    addMessage,
    deleteMessage,
    addConversation,
    updateMessage,
} from "../services/conversation"

export const handleGetMessagesByConversationId = async (req, res) => {
    const conversationId = req.params.conversationId
    try {
        const responses = await getMessagesByConversationId(conversationId)
        // handle error below
        if (responses.errorCode === 2) {
            res.status(500).json(responses)
            return
        }
        res.status(200).json(responses)
    } catch (error) {
        console.log(
            `Error at handleGetMessagesByConversationId: ${error.message}`
        )
        res.status(500).json({
            message: "Internal Server Error",
        })
    }
}

export const handGetConversationByUserId = async (req, res) => {
    //
    const userId = req.params.userId
    try {
        const responses = await getConversationByUserId(userId)
        if (responses.errorCode === 2) {
            res.status(500).json(responses)
            return
        }
        res.status(200).json(responses)
    } catch (error) {
        console.log(`Error at handGetConversationByUserId: ${error.message}`)
        res.status(500).json({
            message: "Internal Server Error",
        })
    }
}

export const handleAddConversation = async (req, res) => {
    const { userId, postId } = req.query
    try {
        const responses = await addConversation({ userId, postId })
        if (responses.message === "NOT FOUND") {
            return res.status(404).json(responses)
        }

        res.status(200).json(responses)
    } catch (error) {
        console.log(`Error at handleAddConversation: ${error.message}`)
        res.status(500).json({
            message: "Internal Server Error",
        })
    }
}

export const handleAddMessage = async (req, res) => {
    const { conversation_id, user_id } = req.query
    const { content } = req.body
    const message = { user_id, content, conversation_id }
    console.log(">>> message: ", message)
    try {
        const responses = await addMessage(message)
        if (responses.errorCode === 2) {
            res.status(500).json(responses)
            return
        }
        res.status(200).json(responses)
    } catch (error) {
        console.log(`Error at handleAddMessage: ${error.message}`)
        res.status(500).json({
            message: "Internal Server Error",
        })
    }
}

export const handleUpdateMessage = async (req, res) => {
    //
    const messageId = req.params.messageId
    const { content } = req.body
    const newMessage = { content }
    console.log(">>> message: ", newMessage)
    try {
        const responses = await updateMessage(newMessage, messageId)
        if (responses.errorCode === 2) {
            res.status(500).json(responses)
            return
        }
        res.status(200).json(responses)
    } catch (error) {
        console.log(`Error at handleUpdateMessage: ${error.message}`)
        res.status(500).json({
            message: "Internal Server Error",
        })
    }
}

export const handleDeleteMessage = async (req, res) => {
    const messageId = req.params.messageId
    try {
        const responses = await deleteMessage(messageId)
        if (responses.errorCode === 2) {
            res.status(500).json(responses)
            return
        }
        res.status(200).json(responses)
    } catch (error) {
        console.log(`Error at handleDeleteMessage: ${error.message}`)
        res.status(500).json({
            message: "Internal Server Error",
        })
    }
}
