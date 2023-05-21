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
        const removeRes = await queryInterface.removeConstraint(
            "Messages",
            "Messages_conversation_id_foreign_idx"
        )
        console.log("+++RemoveConstraint: ", removeRes)

        const changeRes = await queryInterface.changeColumn(
            "Conversations",
            "id",
            {
                type: Sequelize.DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
            }
        )

        console.log("+++ChangeColumn: ", changeRes)

        const addRes = await queryInterface.addConstraint("user_conversation", {
            type: "foreign key",
            fields: ["conversation_id"],
            name: "user_conversation_ibfk_1",
            references: {
                table: "conversations",
                field: "id",
            },
            onDelete: "cascade",
            onUpdate: "cascade",
        })
        console.log("+++AddConstraint: ", addRes)

        const addMessageRes = await queryInterface.addConstraint("Messages", {
            type: "foreign key",
            fields: ["conversation_id"],
            name: "messages_ibfk_2",
            references: {
                table: "conversations",
                field: "id",
            },
            onDelete: "cascade",
            onUpdate: "cascade",
        })
        console.log("+++AddConstraint: ", addMessageRes)
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.changeColumn("Conversations", "id", {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
        })
    },
}
