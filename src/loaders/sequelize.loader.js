const { sequelize } = require("../models");

module.exports = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("DB connected");
  } catch (error) {
    console.error("DB connection failed", error);
    process.exit(1);
  }
};
