module.exports = (...roles) => {
  return (req, res, next) => {
    if (roles.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Authorization roles not configured",
      });
    }

    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};
