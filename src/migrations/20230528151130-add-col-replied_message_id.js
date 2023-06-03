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
            "Messages",
            "replied_message_id",
            {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "Messages",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            }
        )
        console.log("=> addColumn: ", addColumn)

        const addConstraint = await queryInterface.addConstraint("Messages", {
            fields: ["replied_message_id"],
            type: "foreign key",
            name: "fk_message_replied_message_id",
            references: {
                table: "Messages",
                field: "id",
            },
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
        })
        console.log("=> addConstraint: ", addConstraint)
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.removeColumn("Messages", "replied_message_id")
    },
}
