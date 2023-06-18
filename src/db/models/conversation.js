"use strict"
import { Model } from "sequelize"

module.exports = (sequelize, DataTypes) => {
    class Conversation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            console.log(models)
            Conversation.belongsToMany(models.Users, {
                through: "User_Conversation",
                foreignKey: "conversation_id",
                otherKey: "user_id",
                as: "chatMembers",
            })
            Conversation.hasMany(models.Messages, {
                foreignKey: "conversation_id",
                as: "messages",
            })
            Conversation.belongsTo(models.Posts, {
                foreignKey: "post_id",
                as: "post",
            })
            Conversation.belongsToMany(models.Users, {
                through: "Conversations_Hid_Users",
                foreignKey: "conversation_id",
                as: "hid_user",
            })
        }
    }
    Conversation.init(
        {
            title: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            is_hidden: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            post_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
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
            modelName: "Conversations",
        }
    )

    return Conversation
}
