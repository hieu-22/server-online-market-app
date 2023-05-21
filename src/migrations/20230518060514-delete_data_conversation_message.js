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
        const res2 = await queryInterface.sequelize.query(
            "TRUNCATE TABLE user_conversation"
        )
        console.log(">>> At User_Conversation, res2: ", res2)

        const res3 = await queryInterface.bulkDelete("Messages", null, {})
        console.log(">>> At Messages, res3: ", res3)
        const res4 = await queryInterface.sequelize.query(
            "TRUNCATE TABLE messages"
        )
        console.log(">>> At Messages, res4: ", res4)
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
