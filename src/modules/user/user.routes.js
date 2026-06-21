const { ROLES } = require("../../common/constants/roles");
const asyncHandler = require("../../common/middlewares/asyncHandler");
const authMiddleware = require("../../common/middlewares/auth.middleware");
const authorize = require("../../common/middlewares/role.middleware");
const userController = require("./user.controller");

const router = require("express").Router();

router.get("/me", authMiddleware, asyncHandler(userController.getAuthUser));
router.get(
  "/",
  authMiddleware,
  authorize(ROLES.ADMIN),
  asyncHandler(userController.getUsers),
);

router.get("/:id", authMiddleware, asyncHandler(userController.getUserById));

router.patch(
  "/:id/status",
  authMiddleware,
  authorize(ROLES.ADMIN),
  asyncHandler(userController.updateStatus),
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(ROLES.ADMIN),
  asyncHandler(userController.deleteUser),
);

module.exports = router;
