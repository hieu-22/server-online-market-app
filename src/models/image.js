"use strict"
const { Model, Deferrable } = require("sequelize")
import Post from "./post"

module.exports = (sequelize, DataTypes) => {
    class Image extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Image.belongsTo(models.Posts, {
                foreignKey: "post_id",
                as: "Post",
            })
        }
    }
    Image.init(
        {
            imageUrl: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            post_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Images",
        }
    )
    return Image
}