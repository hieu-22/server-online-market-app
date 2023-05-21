"use strict"
const { Model, Deferrable } = require("sequelize")
import User from "./user"
import Post from "./post"

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
        },
        {
            sequelize,
            modelName: "Messages",
        }
    )
    return Message
}
