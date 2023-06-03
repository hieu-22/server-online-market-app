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
        const addColumn = await queryInterface.addColumn(
            "Conversations",
            "is_deleted",
            {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        )
        console.log("=> addColumn: ", addColumn)
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.removeColumn("Conversations", "is_deleted")
    },
}
