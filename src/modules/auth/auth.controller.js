const env = require("../../config/env");
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
  const tokens = await AuthService.login(req.validated);

  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    data: tokens,
    message: "User logged in successfully",
  });
};

exports.logout = async (req, res, next) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: env.nodeEnv === "productiion",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
