"use strict"
import { Model } from "sequelize"

module.exports = (sequelize, DataTypes) => {
    class Conversations_Hid_Users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Conversations_Hid_Users.belongsTo(models.Users, {
                foreignKey: "user_id",
                as: "hid_user",
            })
            Conversations_Hid_Users.belongsTo(models.Conversations, {
                foreignKey: "conversation_id",
                as: "hidden_conversation",
            })
        }
    }
    Conversations_Hid_Users.init(
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
        },
        {
            sequelize,
            modelName: "Conversations_Hid_Users",
            tableName: "conversations_hid_users",
        }
    )
    return Conversations_Hid_Users
}
