"use strict"
import pako from "pako"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Post.hasMany(models.Conversations, {
                foreignKey: "post_id",
                as: "conversations",
            })
            Post.belongsTo(models.Users, {
                foreignKey: "user_id",
                as: "author",
            })
            Post.hasMany(models.Images, {
                foreignKey: "post_id",
                as: "images",
            })
            Post.belongsToMany(models.Users, {
                through: "SavedPosts",
                foreignKey: "post_id",
                as: "savedBy",
            })
        }
    }
    Post.init(
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            product_condition: {
                type: DataTypes.ENUM(
                    "Mới",
                    "Đã sử dụng (chưa sửa chữa)",
                    "Đã sử dụng (qua sửa chữa)"
                ),
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
            },
            post_url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
            },
            expiryDate: {
                allowNull: false,
                type: DataTypes.DATE,
                field: "expirydate",
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
            modelName: "Posts",
        }
    )
    return Post
}
