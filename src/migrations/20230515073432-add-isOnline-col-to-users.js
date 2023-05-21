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
        const removeConstraintMessage = await queryInterface.removeConstraint(
            "messages",
            "messages_ibfk_1"
        )
        console.log(">>> At removeConstraintMessage: ", removeConstraintMessage)

        // add column user
        const addColumnUsers = await queryInterface.addColumn(
            "Users",
            "isOnline",
            {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                after: "address",
            }
        )
        console.log(">>> At addColumnUsers: ", addColumnUsers)

        // change name column
        const renameColumnMessage = await queryInterface.renameColumn(
            "messages",
            "sender",
            "user_id"
        )
        console.log(">>> At renameColumnMessage: ", renameColumnMessage)

        const addConstraintMessage = await queryInterface.addConstraint(
            "messages",
            {
                fields: ["user_id"],
                type: "foreign key",
                name: "messages_ibfk_1",
                references: {
                    table: "users",
                    field: "id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            }
        )
        console.log(">>> At addConstraintMessage: ", addConstraintMessage)
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
