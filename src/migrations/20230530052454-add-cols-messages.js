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

        await queryInterface.addColumn("Messages", "is_hidden_by_another", {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
            after: "content",
        })
        await queryInterface.addColumn("Messages", "is_hidden_by_owner", {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
            after: "content",
        })
        await queryInterface.addColumn("Messages", "is_deleted", {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
            after: "content",
        })
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
