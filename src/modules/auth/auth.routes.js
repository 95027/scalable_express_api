const router = require("express").Router();
const asyncHandler = require("../../common/middlewares/asyncHandler");
const authMiddleware = require("../../common/middlewares/auth.middleware");
const validate = require("../../common/middlewares/validate.middleware");
const authController = require("./auth.controller");
const { registerSchema, loginSchema } = require("./auth.validation");

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(authController.register),
);
router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(authController.login),
);

router.post("/logout", authMiddleware, asyncHandler(authController.logout));

module.exports = router;
