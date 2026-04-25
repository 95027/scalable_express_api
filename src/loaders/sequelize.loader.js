const sequelize = require("../config/db");

module.exports = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");
  } catch (error) {
    console.error("DB connection failed", error);
    process.exit(1);
  }
};
