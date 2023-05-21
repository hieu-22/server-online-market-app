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
        await queryInterface.removeColumn("Messages", "receiver")
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.addColumn("Messages", "receiver", {
            type: Sequelize.INTEGER,
            references: {
                model: "Users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        })
    },
}
