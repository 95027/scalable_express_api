const sequelize = require("../config/db");
const Customer = require("../modules/customer/customer.model");
const AuthIdentity = require("../modules/identity/authIdentity.model");
const User = require("../modules/user/user.model");

const db = {
  sequelize,
  User,
  AuthIdentity,
  Customer,
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
