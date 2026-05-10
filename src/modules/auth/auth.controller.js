const { COOKIE_NAMES } = require("../../common/constants/auth.constants");
const {
  cookieOptions,
  accessCookieOptions,
  refreshCookieOptions,
} = require("../../common/utils/cookies");
const AuthService = require("./auth.service");

exports.register = async (req, res, next) => {
  const user = await AuthService.register(req.validated);

  res.status(201).json({
    message: "User registered successfully",
    success: true,
    data: user,
  });
};

exports.login = async (req, res, next) => {
  const { accessToken, refreshToken } = await AuthService.login(req.validated);

  res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, accessCookieOptions);

  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, refreshCookieOptions);

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
  });
};

exports.logout = async (req, res, next) => {
  res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, cookieOptions);
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

exports.refreshToken = async (req, res, next) => {
  const token = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN];

  const accessToken = await AuthService.refreshAccessToken(token);

  res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, accessCookieOptions);

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
  });
};
