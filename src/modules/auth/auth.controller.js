const AuthService = require("./auth.service");

exports.register = async (req, res, next) => {
  const data = req.validated;
  const tokens = await AuthService.register(data);

  res.status(201).json({
    message: "User registered successfully",
    success: true,
    data: tokens,
  });
};

exports.login = async (req, res, next) => {
  const data = req.validated;
  const tokens = await AuthService.login(data);

  res.status(200).json({
    success: true,
    data: tokens,
    message: "User logged in successfully",
  });
};

