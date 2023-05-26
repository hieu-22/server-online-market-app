import express from "express"
import {
    handleGetMessagesByConversationId,
    handGetConversationByUserId,
    handleAddConversation,
    handleAddMessage,
    handleUpdateMessage,
    handleDeleteMessage,
} from "../controllers/conversation"

const router = express.Router()

/**CREATE */
router.post("/messages/create", handleAddMessage)
router.post("/conversations/create", handleAddConversation)
/**READ */
router.get(
    "/conversation/:conversationId/messages",
    handleGetMessagesByConversationId
)
router.get("/conversation/get-all", handGetConversationByUserId)

/**UPDATE */
router.patch(
    "/conversations/:conversationId/messages/:messageId/update",
    handleUpdateMessage
)
/**DELETE */
router.delete(
    "/conversations/:conversationId/messages/:messageId/delete",
    handleDeleteMessage
)

export default router
