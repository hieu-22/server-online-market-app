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
        await queryInterface.removeColumn("Messages", "post_id")
        await queryInterface.addColumn("Messages", "conversation_id", {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "Conversations",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        })
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.addColumn("Messages", "post_id", {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "Posts",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        })
        await queryInterface.removeColumn("Messages", "conversation_id")
    },
}
