"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        const res1 = await queryInterface.bulkDelete(
            "User_Conversation",
            null,
            {}
        )
        console.log(">>> At User_Conversation, res1: ", res1)

        const res2 = await queryInterface.bulkDelete("Messages", null, {})
        console.log(">>> At Messages, res2: ", res2)

        const res3 = await queryInterface.bulkDelete("Conversations", null, {})
        console.log(">>> At Conversations, res3: ", res3)

        const res4 = await queryInterface.bulkDelete("Images", null, {})
        console.log(">>> At Images, res4: ", res4)

        const res5 = await queryInterface.bulkDelete("SavedPosts", null, {})
        console.log(">>> At SavedPosts, res5: ", res5)

        const res6 = await queryInterface.bulkDelete("Posts", null, {})
        console.log(">>> At Posts, res6: ", res6)
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
    },
}
