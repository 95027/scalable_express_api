const sequelize = require("../config/db");
const AuthIdentity = require("../modules/auth/authIdentity.model");
const User = require("../modules/user/user.model");

const db = {
  sequelize,
  User,
  AuthIdentity,
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
