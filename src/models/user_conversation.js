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
        }
    }
    User_Conversation.init(
        {},
        {
            sequelize,
            modelName: "User_Conversation",
            tableName: "user_conversation",
        }
    )

    return User_Conversation
}
