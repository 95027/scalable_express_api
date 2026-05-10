const ms = require("ms");
const env = require("../../config/env");

exports.cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "lax",
};

exports.accessCookieOptions = {
  ...exports.cookieOptions,
  maxAge: ms(env.jwt.accessExpiresIn),
};

exports.refreshCookieOptions = {
  ...exports.cookieOptions,
  maxAge: ms(env.jwt.refreshExpiresIn),
};
