import db from "../models/index"
import { Op, where } from "sequelize"
/**CREATE */
export const addConversationByPost = async ({ userId, postId }) => {
    try {
        // find Post and author to get author id
        const post = await db.Posts.findByPk(postId, {
            attributes: ["title", "user_id"],
        })
        if (!post) {
            return {
                errorCode: 1,
                message: "POST NOT FOUND",
            }
        }
        const newConversation = {
            title: post.dataValues.title,
            post_id: postId,
        }
        const postUserId = post.dataValues.user_id

        const existedConversationsByPostId = await db.Conversations.findAll({
            where: {
                post_id: postId,
            },
            include: {
                model: db.Users,
                as: "chatMembers",
                through: { attributes: ["user_id"] },
            },
        })
        let conversationExisted = false
        let existedConversationId
        for (let i = 0; i < existedConversationsByPostId.length; i++) {
            // console.log(
            //     "=> At i =",
            //     i,
            //     " :",
            //     existedConversationsByPostId[i].chatMembers[0].User_Conversation
            //         .user_id,
            //     "and userId: ",
            //     userId
            // )
            const chatUserId = existedConversationsByPostId[i].chatMembers.some(
                (member) => member.User_Conversation.user_id === +userId
            )
            // console.log("conversationExisted: ", chatUserId)
            if (chatUserId) {
                conversationExisted = true
                existedConversationId = existedConversationsByPostId[i].id
                break
            }
        }

        if (conversationExisted) {
            const delRes = await db.Conversations_Hid_Users.destroy({
                where: {
                    [Op.and]: [
                        { conversation_id: existedConversationId },
                        { user_id: userId },
                    ],
                },
            })
            const updateRes = await db.Conversations.update(
                {
                    is_hidden: false,
                },
                {
                    where: {
                        id: existedConversationId,
                    },
                }
            )
            return {
                chatId: existedConversationId,
                errorCode: 1,
                message: "CHAT ALREADY EXISTED",
            }
        }

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
                    as: "hid_user",
                    through: { attributes: [] },
                    attributes: ["id"],
                },
                {
                    model: db.Messages,
                    as: "messages",
                    order: [["createdAt", "DESC"]],
                },
                {
                    model: db.Users,
                    as: "chatMembers",
                    through: { attributes: [] },
                },

                {
                    model: db.Posts,
                    as: "post",
                    attributes: ["title", "price", "post_url"],
                    include: {
                        model: db.Images,
                        as: "images",
                    },
                },
            ],
            order: [],
        })
        return {
            chat: Chat,
            errorCode: 0,
            message: "Create conversation successfully!",
        }
    } catch (error) {
        // console.log("ERROR at addConversation: ", error.message)
        return {
            errorCode: 2,
            message: "Failed to create chat!",
            errorMessage: error.message,
        }
    }
}

export const addConversationByUser = async ({ userId, otherUserId }) => {
    try {
        // check if the conversations between the two user is existed or not
        // -- find where post_id is null
        const existedConversations = await db.Conversations.findAll({
            where: {
                post_id: null,
            },
            include: {
                model: db.Users,
                as: "chatMembers",
                through: { attributes: ["user_id"] },
            },
        })
        let conversationExisted = false
        let existedConversationId
        // -- check each chatMembers of each post is match with user_conversations
        for (let i = 0; i < existedConversations.length; i++) {
            // console.log(
            //     "=> At i =",
            //     i,
            //     " :",
            //     existedConversations[i].chatMembers[0].User_Conversation
            //         .user_id,
            //     "and userId: ",
            //     userId
            // )
            const checkUserId = existedConversations[i].chatMembers.some(
                (member) => member.User_Conversation.user_id === +userId
            )

            const checkOtherUserId = existedConversations[i].chatMembers.some(
                (member) => member.User_Conversation.user_id === +otherUserId
            )
            // console.log("conversationExisted: ", chatUserId)
            if (checkUserId && checkOtherUserId) {
                conversationExisted = true
                existedConversationId = existedConversations[i].id
                break
            }
        }
        if (conversationExisted) {
            const delRes = await db.Conversations_Hid_Users.destroy({
                where: {
                    [Op.and]: [
                        { conversation_id: existedConversationId },
                        { user_id: userId },
                    ],
                },
            })
            const updateRes = await db.Conversations.update(
                {
                    is_hidden: false,
                },
                {
                    where: {
                        id: existedConversationId,
                    },
                }
            )
            return {
                chatId: existedConversationId,
                errorCode: 1,
                message: "CHAT ALREADY EXISTED",
            }
        }
        // -------------------------------------------------
        /**CHAT DOESN'T EXIST */
        // Create conversation
        const result = await db.Conversations.create({})
        // console.log("--- Creating result: ", result)
        const conversationId = result.dataValues.id
        // --create user_conversation
        const newChatMembers = [
            { conversation_id: conversationId, user_id: userId },
            { conversation_id: conversationId, user_id: otherUserId },
        ]
        const conversationMembers = await db.User_Conversation.bulkCreate(
            newChatMembers
        )

        const Chat = await db.Conversations.findByPk(conversationId, {
            include: [
                {
                    model: db.Users,
                    as: "hid_user",
                    through: { attributes: [] },
                    attributes: ["id"],
                },
                {
                    model: db.Messages,
                    as: "messages",
                    order: [["createdAt", "DESC"]],
                },
                {
                    model: db.Users,
                    as: "chatMembers",
                    through: { attributes: [] },
                },

                {
                    model: db.Posts,
                    as: "post",
                    attributes: ["title", "price", "post_url"],
                    include: {
                        model: db.Images,
                        as: "images",
                    },
                },
            ],
            order: [],
        })
        return {
            chat: Chat,
            errorCode: 0,
            message: "Create conversation successfully!",
        }
    } catch (error) {
        // console.log("ERROR at addConversation: ", error.message)
        return {
            errorCode: 2,
            message: "Failed to create chat!",
            errorMessage: error.message,
        }
    }
}

export const addMessage = async ({ user_id, content, conversation_id }) => {
    const newMessage = { user_id, content, conversation_id }
    try {
        const message = await db.Messages.create(newMessage)
        // conversation updatedAt updating
        const conversation = await db.Conversations.findByPk(conversation_id)

        await db.Conversations.update(
            {
                title: conversation.dataValues.title,
            },
            {
                where: {
                    id: conversation_id,
                },
            }
        )

        // console.log(">>> created message: ", createdMessage.dataValues.id)
        const createdMessage = await db.Messages.findByPk(message.dataValues.id)

        await db.Conversations_Hid_Users.destroy({
            where: {
                conversation_id: conversation_id,
            },
        })

        return {
            newMessage: createdMessage,
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
export const getConversationByUserId = async ({ userId }) => {
    try {
        const conversations = await db.User_Conversation.findAll({
            attributes: [],
            where: {
                user_id: userId,
            },
            include: {
                model: db.Conversations,
                as: "conversation",
                include: [
                    {
                        model: db.Users,
                        as: "hid_user",
                        through: { attributes: [] },
                        attributes: ["id"],
                    },
                    {
                        model: db.Messages,
                        as: "messages",
                        order: [["createdAt", "DESC"]],
                        limit: 1,
                    },
                    {
                        model: db.Users,
                        as: "chatMembers",
                        through: { attributes: [] },
                    },
                    {
                        model: db.Posts,
                        as: "post",
                        attributes: ["title", "price", "post_url"],
                        include: {
                            model: db.Images,
                            as: "images",
                        },
                    },
                ],
                order: [["updatedAt", "ASC"]],
            },
        })
        return {
            chats: conversations,
            errorCode: 0,
            message: "Ok",
        }
    } catch (error) {
        console.log(error)
        return {
            message: "Failed to get conversations",
            errorCode: 2,
            errorMessage: error.message,
        }
    }
}
export const getChatById = async ({ conversationId, userId }) => {
    try {
        const chatUserRelation = await db.User_Conversation.findAll({
            where: {
                conversation_id: conversationId,
                user_id: userId,
            },
        })
        // console.log("check: ", chatUserRelation)
        const chat = await db.Conversations.findByPk(conversationId, {
            include: [
                {
                    model: db.Users,
                    as: "hid_user",
                    through: { attributes: [] },
                    attributes: ["id"],
                },
                {
                    model: db.Messages,
                    as: "messages",
                    order: [["createdAt", "DESC"]],
                    limit: 20,
                },
                {
                    model: db.Users,
                    as: "chatMembers",
                    through: { attributes: [] },
                },

                {
                    model: db.Posts,
                    as: "post",
                    attributes: ["title", "price", "post_url"],
                    include: {
                        model: db.Images,
                        as: "images",
                    },
                },
            ],
        })

        if (!chat) {
            return {
                statusCode: 404,
                message: "CHAT NOT FOUND",
            }
        }

        if (chatUserRelation.length === 0 && Boolean(chat)) {
            return {
                statusCode: 403,
                message: "Access Denied",
            }
        }

        const filteredMessages = await chat.messages.filter(
            (message) =>
                !(
                    (message.is_hidden_by_owner &&
                        message.user_id === +userId) ||
                    (message.is_hidden_by_another &&
                        message.user_id !== +userId)
                )
        )

        chat.dataValues.messages = filteredMessages

        return {
            chat: chat,
            errorCode: 0,
            message: "ok",
        }
    } catch (error) {
        return {
            errorCode: 2,
            errorMessage: error.message,
        }
    }
}

export const getMoreMessagesById = async ({ chatId, offset }) => {
    try {
        const messages = await db.Messages.findAll({
            where: {
                conversation_id: chatId,
            },
            order: [["createdAt", "DESC"]],
            offset: offset,
            limit: 10,
        })
        return {
            messages: messages,
            errorCode: 0,
            message: "OK",
        }
    } catch (error) {
        return {
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
        // console.log(">>> Update result: ", updateResult)

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
        console.log("Error at updateMessage: ", error.message)
        return {
            message: "Failed to update message",
            errorCode: 2,
            errorMessage: error.message,
        }
    }
}
export const updateMessageReadByAnother = async (
    newMessage,
    messageId,
    userId
) => {
    try {
        // do update
        const updateResult = await db.Messages.update(newMessage, {
            where: {
                id: messageId,
                user_id: {
                    [Op.ne]: userId,
                },
            },
        })
        // console.log(">>> Update result: ", updateResult)

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
        console.log("Error at updateMessageReadByAnother: ", error.message)
        return {
            message: "Failed to update message",
            errorCode: 2,
            errorMessage: error.message,
        }
    }
}

/**DELETE */
export const hideMessageByOwner = async ({
    userId,
    messageId,
    conversationId,
}) => {
    try {
        const deletingResult = await db.Messages.update(
            {
                is_hidden_by_owner: true,
            },
            {
                where: {
                    id: messageId,
                },
            }
        )
        // console.log(">>> Deleting Result", deletingResult)
        return {
            message: "hide message successfully!",
            errorCode: 0,
        }
    } catch (error) {
        console.log("Error at hideMessageByOwner: ", error.message)
        return {
            message: "Failed to delte message",
            errorCode: 2,
            errorMessage: error.message,
        }
    }
}

export const hideMessageByAnother = async ({
    userId,
    messageId,
    conversationId,
}) => {
    try {
        const deletingResult = await db.Messages.update(
            {
                is_hidden_by_another: true,
            },
            {
                where: {
                    id: messageId,
                },
            }
        )

        return {
            message: "hide message successfully!",
            errorCode: 0,
        }
    } catch (error) {
        console.log("Error at hideMessageByAnother: ", error.message)
        return {
            message: "Failed to delte message",
            errorCode: 2,
            errorMessage: error.message,
        }
    }
}

export const deleteMessageById = async ({
    userId,
    messageId,
    conversationId,
}) => {
    try {
        const deletingResult = await db.Messages.update(
            {
                is_deleted: true,
            },
            {
                where: {
                    id: messageId,
                },
            }
        )
        return {
            message: "delete message successfully!",
            errorCode: 0,
        }
    } catch (error) {
        console.log("Error at hideMessageByAnother: ", error.message)
        return {
            message: "Failed to delte message",
            errorCode: 2,
            errorMessage: error.message,
        }
    }
}
export const deleteChatByUserId = async ({ conversation_id, user_id }) => {
    try {
        await db.Conversations.update(
            {
                is_hidden: true,
            },
            {
                where: {
                    id: conversation_id,
                },
            }
        )
        await db.Conversations_Hid_Users.create({
            conversation_id,
            user_id,
        })
        await db.Messages.update(
            { is_hidden_by_owner: true },
            {
                where: {
                    conversation_id: conversation_id,
                    user_id: user_id,
                },
            }
        )

        await db.Messages.update(
            { is_hidden_by_another: true },
            {
                where: {
                    conversation_id: conversation_id,
                    user_id: {
                        [Op.ne]: user_id,
                    },
                },
            }
        )

        await db.Conversations.update(
            {},
            {
                where: {
                    id: conversation_id,
                },
            }
        )
        return {
            errorCode: 0,
            message: "hide message successfully!",
        }
    } catch (error) {
        console.log("Error at deleteChatByUserId: ", error.message)
        return {
            message: "Failed to update message",
            errorCode: 2,
            errorMessage: error.message,
        }
    }
}
