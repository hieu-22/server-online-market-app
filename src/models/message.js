"use strict"
const { Model } = require("sequelize")
import db from "./index"

module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Message.belongsTo(models.Conversations, {
                foreignKey: "conversation_id",
                as: "conversation",
            })

            Message.belongsTo(models.Users, {
                foreignKey: "user_id",
                as: "user",
            })
            Message.hasOne(models.Messages, {
                foreignKey: "replied_message_id",
                as: "repliedMessage",
            })
        }
    }
    Message.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            content: {
                type: DataTypes.STRING,
                get() {
                    const encodedContent = this.getDataValue("content")
                    return encodedContent
                        ? Buffer.from(encodedContent, "base64").toString(
                              "utf-8"
                          )
                        : null
                },
                set(value) {
                    this.setDataValue(
                        "content",
                        value ? Buffer.from(value).toString("base64") : null
                    )
                },
            },
            conversation_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            replied_message_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            is_read_by_another: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            is_hidden_by_owner: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            is_hidden_by_another: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Messages",
        }
    )
    return Message
}
