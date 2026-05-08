require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  clientUrls: process.env.CLIENT_URLS,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
  },
};
