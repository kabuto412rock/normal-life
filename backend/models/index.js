const Sequelize = require("sequelize");
const sequelize = new Sequelize('sqlite::memory');
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.costs = require("./cost")(sequelize, Sequelize);

module.exports = db;