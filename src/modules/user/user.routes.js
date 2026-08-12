const { ROLES } = require("../../common/constants/roles");
const asyncHandler = require("../../common/middlewares/asyncHandler");
const authorize = require("../../common/middlewares/role.middleware");
const userController = require("./user.controller");

const router = require("express").Router();

router.get("/me", asyncHandler(userController.getAuthUser));

router.get("/:id", authorize(ROLES.ADMIN), asyncHandler(userController.getUserById));

router.patch(
  "/:id/status",
  authorize(ROLES.ADMIN),
  asyncHandler(userController.updateStatus),
);

router.delete(
  "/:id",
  authorize(ROLES.ADMIN),
  asyncHandler(userController.deleteUser),
);

module.exports = router;
