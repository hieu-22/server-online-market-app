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
        await queryInterface.changeColumn("Posts", "post_url", {
            type: Sequelize.STRING,
            allowNull: false,
            after: "description",
        })
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.changeColumn("Posts", "post_url", {
            type: Sequelize.STRING,
            allowNull: false,
            after: "updatedAt",
        })
    },
}
