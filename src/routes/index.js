const router = require("express").Router();

const { authLimiter } = require("../common/middlewares/rateLimit.middleware");
const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require("../modules/user/user.routes");
const fileRoutes = require("../modules/file/file.routes");

router.use("/auth", authLimiter, authRoutes);
router.use("/user", userRoutes);
router.use("/upload", fileRoutes);

module.exports = router;
