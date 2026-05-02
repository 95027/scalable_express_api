const router = require("express").Router();
const asyncHandler = require("../../common/middlewares/asyncHandler");
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

module.exports = router;
