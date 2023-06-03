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
        await queryInterface.changeColumn("conversations", "post_id", {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "posts",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            after: "title",
        })
        await queryInterface.changeColumn("conversations", "is_hidden", {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            after: "post_id",
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
