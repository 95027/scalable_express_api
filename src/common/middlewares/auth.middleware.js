const env = require("../../config/env");
const jwt = require("jsonwebtoken");
const { User } = require("../../models");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.jwt.secret);

    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    req.user = user.get({ plain: true });

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    next(error);
  }
};
