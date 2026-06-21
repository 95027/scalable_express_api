const router = require("express").Router();

const { authLimiter } = require("../common/middlewares/rateLimit.middleware");
const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require("../modules/user/user.routes");

router.use("/auth", authLimiter, authRoutes);
router.use("/users", userRoutes);

module.exports = router;
