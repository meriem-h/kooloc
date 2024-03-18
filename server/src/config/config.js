require("dotenv").config({ path: "../.env" });

module.exports = {
    username: process.env.USER_DATABASE,
    password: process.env.USER_DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: "127.0.0.1",
    dialect: "mysql",
};