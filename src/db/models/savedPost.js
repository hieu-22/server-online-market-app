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
            SavedPost.belongsTo(models.Posts, {
                foreignKey: "post_id",
                as: "post",
            })
            SavedPost.belongsTo(models.Users, {
                foreignKey: "user_id",
                as: "user",
            })
        }
    }
    SavedPost.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            post_id: {
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
            modelName: "SavedPosts",
        }
    )

    return SavedPost
}
