"use strict"
const { Model, Deferrable } = require("sequelize")
const User = require("./user")
module.exports = (sequelize, DataTypes) => {
    class Relationship extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Relationship.belongsTo(models.Users, {
                foreignKey: "followedUser",
                as: "followedUserInfo",
            })
            Relationship.belongsTo(models.Users, {
                foreignKey: "follower",
                as: "followerInfo",
            })
        }
    }
    Relationship.init(
        {
            followedUser: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            follower: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Relationships",
        }
    )
    return Relationship
}
