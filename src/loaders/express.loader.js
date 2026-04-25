const express = require("express");
const routes = require("../routes");

module.exports = () => {
  const app = express();

  app.use(express.json());

  app.use("/api/v1", routes);

  app.get("/health", (req, res) => res.send("OK"));

  return app;
};
