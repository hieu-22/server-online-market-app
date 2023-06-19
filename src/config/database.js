module.exports = {
    development: {
        userName: "postgres",
        password: "212292",
        database: "postgres",
        host: "127.0.0.1",
        port: 5432,
        dialect: "postgres",
        schema: "onlineMarketDB",
        ssl: false,
        dialectOptions: {
            bigNumberStrings: true,
            ssl: false,
        },
        timestamp: true,
        timezone: "+07:00",
        logging: false,
        seederStorage: "sequelize",
        seederStorageTableName: "sequelize_data",
        define: {
            schema: "onlineMarketDB",
        },
        migrationStorageTableName: "sequelize_meta",
        migrationStorageTableSchema: "onlineMarketDB",
        searchPath: "onlineMarketDB",
    },
    test: {
        userName: process.env.CI_DB_USERNAME,
        password: process.env.CI_DB_PASSWORD,
        database: process.env.CI_DB_NAME,
        host: "127.0.0.1",
        port: 3306,
        dialect: "mysql",
        dialectOptions: {
            bigNumberStrings: true,
        },
    },
    production: {
        userName: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        schema: process.env.DB_SCHEMA,
        ssl: true,
        dialectOptions: {
            bigNumberStrings: true,
        },
        define: {
            schema: "onlineMarketDB",
        },
        searchPath: "onlineMarketDB",
        timestamp: true,
        timezone: "+07:00",
        logging: false,
    },
}
