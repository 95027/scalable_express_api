const sequelize = require("../config/db");
const User = require("../modules/user/user.model");

const db = {
  sequelize,
  User,
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
