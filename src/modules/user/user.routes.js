const asyncHandler = require("../../common/middlewares/asyncHandler");
const authMiddleware = require("../../common/middlewares/auth.middleware");
const userController = require("./user.controller");

const router = require("express").Router();

router.get("/me", authMiddleware, asyncHandler(userController.getAuthUser));

module.exports = router;
