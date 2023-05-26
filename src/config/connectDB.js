import { Sequelize } from "sequelize"

const connectDB = () => {
    const sequelize = new Sequelize("my_db", "root", "@Email123", {
        host: "localhost",
        dialect: "mysql",
        logging: false,
    })

    ;(async () => {
        try {
            await sequelize.authenticate()
            console.log("Connection has been established successfully.")
        } catch (error) {
            console.error("Unable to connect to the database:", error)
        }
    })()
}

export default connectDB
