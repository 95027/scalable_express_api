const Authservice = require("./auth.service");

exports.register = async (req, res, next) => {
  const data = req.validated;
  const tokens = await Authservice.register(data);

  res.status(201).json({
    message: "User registered successfully",
    success: true,
    data: tokens,
  });
};

exports.login = async (req, res, next) => {
  const data = req.validated;
  const tokens = await Authservice.login(data.email, data.password);

  res.json({
    success: true,
    data: tokens,
    message: "User logged in successfully",
  });
};
