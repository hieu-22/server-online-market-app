import express from "express"
import {
    handleGetMessagesByConversationId,
    handGetConversationByUserId,
    handleAddConversationByPost,
    handleAddMessage,
    handleUpdateMessage,
    handleDeleteMessage,
    handleDeleteChatByUserId,
} from "../controllers/conversation"

const router = express.Router()

/**CREATE */
// router.post("/messages/create", handleAddMessage)
router.post("/conversations/create", handleAddConversationByPost)
// /**READ */
// router.get(
//     "/conversation/:conversationId/messages",
//     handleGetMessagesByConversationId
// )
// router.get("/conversation/get-all", handGetConversationByUserId)

// /**UPDATE */
// router.patch(
//     "/conversations/:conversationId/messages/:messageId/update",
//     handleUpdateMessage
// )
// /**DELETE */
// router.delete(
//     "/conversations/:conversationId/messages/:messageId/delete",
//     handleDeleteMessage
// )
// router.delete("/conversations/delete", handleDeleteChatByUserId)

export default router
