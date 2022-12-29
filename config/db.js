const { Sequelize } = require("sequelize");
const createDB = new Sequelize("test-db", "user", "pass", {
    dialect: "sqlite",
    host: "./config/db.sqlite"
});

const connectDB = () => {
    createDB.sync().then(() => {
        console.log("connected to the db");
    })
        .catch((err) => {
            console.log("cannot connected to the db", err)
        })
}

module.exports = { createDB, connectDB };