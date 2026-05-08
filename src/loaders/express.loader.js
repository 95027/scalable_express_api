const express = require("express");
const routes = require("../routes");
const errorMiddleware = require("../common/middlewares/error.middleware");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const env = require("../config/env");

module.exports = () => {
  const app = express();

  app.disable("x-powered-by");

  app.use(helmet());

  app.use(
    cors({
      origin: env.clientUrls.split(","),
      credentials: true,
    }),
  );

  app.use(express.json());

  app.use(cookieParser());

  app.use("/api/v1", routes);

  app.get("/", (req, res) => {
    res.status(200).json({ message: "API is running..." });
  });

  app.use(errorMiddleware);

  return app;
};
