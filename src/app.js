const expressLoader = require("../src/loaders/express.loader");
const sequelizeLoader = require("../src/loaders/sequelize.loader");

module.exports = async function startServer() {
  await sequelizeLoader();

  const app = expressLoader();

  return app;
};
