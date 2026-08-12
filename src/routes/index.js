const router = require("express").Router();

const { authLimiter } = require("../common/middlewares/rateLimit.middleware");
const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require("../modules/user/user.routes");
const fileRoutes = require("../modules/file/file.routes");
const authMiddleware = require("../common/middlewares/auth.middleware");
const customerRoutes = require("../modules/customer/customer.routes");


router.use("/auth", authLimiter, authRoutes);
router.use("/user", authMiddleware, userRoutes);
router.use("/customer", authMiddleware, customerRoutes);
router.use("/upload", fileRoutes);

module.exports = router;
