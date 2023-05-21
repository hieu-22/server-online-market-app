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

        await queryInterface.changeColumn("Posts", "describtion", {
            type: Sequelize.STRING,
            allowNull: false,
            field: "description",
        })
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.changeColumn("Posts", "description", {
            type: Sequelize.STRING,
            allowNull: false,
            field: "describtion",
        })
    },
}
