const router = require("express").Router();
const asyncHandler = require("../../common/middlewares/asyncHandler");
const validate = require("../../common/middlewares/validate.middleware");
const authController = require("./auth.controller");
const { registerSchema } = require("./auth.validation");

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(authController.register),
);
router.post(
  "/login",
  validate(registerSchema),
  asyncHandler(authController.login),
);

module.exports = router;
