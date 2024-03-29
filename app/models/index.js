const dbConfig = require("../config/db.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Customer = require("./customer.model.js")(sequelize, Sequelize);
db.Card = require("./cardinfo.model.js")(sequelize, Sequelize);

module.exports = db;