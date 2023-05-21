"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable("Users", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            userName: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            avatar: {
                type: Sequelize.DataTypes.STRING,
            },
            phoneNumber: {
                type: Sequelize.DataTypes.STRING(11),
                unique: true,
            },
            address: {
                type: Sequelize.DataTypes.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DataTypes.DATE,
            },
        })

        await queryInterface.createTable("Posts", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: Sequelize.DataTypes.DECIMAL,
                allowNull: false,
            },
            product_condition: {
                type: Sequelize.DataTypes.ENUM(
                    "Mới",
                    "Đã sử dụng (chưa sửa chữa)",
                    "Đã sử dụng (qua sửa chữa)"
                ),
                allowNull: false,
            },
            describtion: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.DataTypes.INTEGER,
                references: {
                    model: "Users",
                    key: "id",
                    deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DataTypes.DATE,
            },
        })

        await queryInterface.createTable("Messages", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            sender: {
                type: Sequelize.DataTypes.INTEGER,
                references: {
                    model: "Users",
                    key: "id",
                    deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
                },
                allowNull: false,
            },
            receiver: {
                type: Sequelize.DataTypes.INTEGER,
                references: {
                    model: "Users",
                    key: "id",
                    deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
                },
                allowNull: false,
            },
            content: {
                type: Sequelize.DataTypes.STRING,
            },
            post_id: {
                type: Sequelize.DataTypes.INTEGER,
                references: {
                    model: "Posts",
                    key: "id",
                    deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
                },
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DataTypes.DATE,
            },
        })

        await queryInterface.createTable("Relationships", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            followingUser: {
                type: Sequelize.DataTypes.INTEGER,
                references: {
                    model: "Users",
                    key: "id",
                    deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
                },
            },
            follower: {
                type: Sequelize.DataTypes.INTEGER,
                references: {
                    model: "Users",
                    key: "id",
                    deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
                },
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DataTypes.DATE,
            },
        })

        await queryInterface.createTable("Images", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            imageUrl: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            post_id: {
                type: Sequelize.DataTypes.INTEGER,
                references: {
                    model: "Posts",
                    key: "id",
                    deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
                },
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DataTypes.DATE,
            },
        })
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
    },
}
