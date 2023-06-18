"use strict"
const { Model } = require("sequelize")

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
                field: "imageurl",
            },
            post_id: {
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
            modelName: "Images",
        }
    )
    return Image
}
