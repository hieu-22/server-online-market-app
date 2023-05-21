"use strict"
import { Model } from "sequelize"

module.exports = (sequelize, DataTypes) => {
    class SavedPost extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    SavedPost.init(
        {},
        {
            sequelize,
            modelName: "SavedPosts",
            tableName: "savedPosts",
        }
    )

    return SavedPost
}