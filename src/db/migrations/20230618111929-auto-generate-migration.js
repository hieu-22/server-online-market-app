"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("users", {
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
            isOnline: {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: false,
            },
            introduction: {
                type: Sequelize.DataTypes.TEXT,
                defaultValue: "",
            },
            createdAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
        })

        await queryInterface.createTable("posts", {
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
            description: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: false,
            },
            address: {
                type: Sequelize.DataTypes.STRING,
            },
            post_url: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.DataTypes.INTEGER,
                references: {
                    model: "users",
                    key: "id",
                },
                onDelete: "CASECADE",
                onUpdate: "CASECADE",
            },
            expiryDate: {
                allowNull: false,
                type: Sequelize.DataTypes.DATE,
            },
            createdAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
        })

        await queryInterface.createTable("images", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            imageUrl: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            post_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "posts",
                    key: "id",
                },
                onDelete: "CASECADE",
                onUpdate: "CASECADE",
            },
            createdAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
        })

        await queryInterface.createTable("savedposts", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            post_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "posts",
                    key: "id",
                },
                onDelete: "CASECADE",
                onUpdate: "CASECADE",
            },
            user_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onDelete: "CASECADE",
                onUpdate: "CASECADE",
            },
            createdAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
        })

        await queryInterface.createTable("relationships", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            followedUser: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onDelete: "CASECADE",
                onUpdate: "CASECADE",
            },
            follower: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onDelete: "CASECADE",
                onUpdate: "CASECADE",
            },
            createdAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
        })

        await queryInterface.createTable("conversations", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
            },
            is_hidden: {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: false,
            },
            post_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "posts",
                    key: "id",
                },
                onDelete: "CASECADE",
                onUpdate: "CASECADE",
            },
            createdAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
        })
        await queryInterface.createTable("messages", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onDelete: "CASECADE",
                onUpdate: "CASECADE",
            },
            content: {
                type: Sequelize.DataTypes.STRING,
            },
            conversation_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "conversations",
                    key: "id",
                },
                onDelete: "CASECADE",
                onUpdate: "CASECADE",
            },
            replied_message_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "messages",
                    key: "id",
                },
                onDelete: "CASECADE",
                onUpdate: "CASECADE",
            },
            is_read_by_another: {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: false,
            },
            is_deleted: {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            is_hidden_by_owner: {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            is_hidden_by_another: {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
        })
        await queryInterface.createTable("conversations_hid_users", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            conversation_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "conversations",
                    key: "id",
                },
                onDelete: "CASECADE",
                onUpdate: "CASECADE",
            },
            user_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onDelete: "CASECADE",
                onUpdate: "CASECADE",
            },
            createdAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
        })
        await queryInterface.createTable("user_conversation", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            conversation_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "conversations",
                    key: "id",
                },
                onDelete: "CASECADE",
                onUpdate: "CASECADE",
            },
            user_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onDelete: "CASECADE",
                onUpdate: "CASECADE",
            },
            createdAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
        })
    },

    async down(queryInterface, Sequelize) {},
}
