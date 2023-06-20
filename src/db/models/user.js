"use strict"
import bcrypt from "bcrypt"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsToMany(models.Conversations, {
                through: "User_Conversation",
                foreignKey: "user_id",
                otherKey: "conversation_id",
                as: "chats",
            })
            User.hasMany(models.Messages, {
                foreignKey: "user_id",
                as: "messages",
            })
            User.hasMany(models.Posts, {
                foreignKey: "user_id",
                as: "posts",
            })
            User.hasMany(models.Relationships, {
                foreignKey: "followedUser",
                as: "followers",
            })
            User.hasMany(models.Relationships, {
                foreignKey: "follower",
                as: "followingUsers",
            })
            User.belongsToMany(models.Posts, {
                through: "SavedPosts",
                foreignKey: "user_id",
                as: "savedPosts",
            })
            User.belongsToMany(models.Conversations, {
                through: "Conversations_Hid_Users",
                foreignKey: "user_id",
                as: "hidden_conversation",
            })
        }
    }
    User.init(
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                set(value) {
                    if (!value) return
                    // console.log(">>> At user.set(value) - value: ", value)
                    const salt = bcrypt.genSaltSync(12)
                    const hashPassword = bcrypt.hashSync(value, salt)

                    this.setDataValue("password", hashPassword)
                },
            },
            userName: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "username",
            },
            avatar: {
                type: DataTypes.STRING,
            },
            phoneNumber: {
                type: DataTypes.STRING(11),
                unique: true,
                field: "phonenumber",
            },
            isOnline: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                field: "isonline",
            },
            introduction: {
                type: DataTypes.TEXT,
                defaultValue: "",
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
                defaultValue: DataTypes.NOW,
                timezone: "+07:00",
            },
        },
        {
            sequelize,
            modelName: "Users",
        }
    )

    return User
}
