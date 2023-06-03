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
        const createTableRes = await queryInterface.createTable(
            "conversations_hid_users",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                conversation_id: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                    references: {
                        model: "conversations",
                        key: "id",
                    },
                    onDelete: "CASCADE",
                },
                user_id: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                    references: {
                        model: "users",
                        key: "id",
                    },
                    onDelete: "CASCADE",
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
            }
        )
        console.log("=> createTableRes: ", createTableRes)
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable("conversations_hid_users")
    },
}
