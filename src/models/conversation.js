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
        }
    }
    Conversation.init(
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            post_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Conversations",
        }
    )

    return Conversation
}
