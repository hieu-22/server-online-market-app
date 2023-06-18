"use strict"
import { Model } from "sequelize"

module.exports = (sequelize, DataTypes) => {
    class User_Conversation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User_Conversation.belongsTo(models.Users, {
                foreignKey: "user_id",
                as: "user",
            })
            User_Conversation.belongsTo(models.Conversations, {
                foreignKey: "conversation_id",
                as: "conversation",
            })
        }
    }
    User_Conversation.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            conversation_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
                field: "createdat",
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
                field: "updatedat",
            },
        },
        {
            sequelize,
            modelName: "User_Conversation",
            tableName: "User_Conversation",
        }
    )

    return User_Conversation
}
