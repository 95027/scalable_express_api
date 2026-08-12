const asyncHandler = require("../../common/middlewares/asyncHandler");
const router = require("express").Router();
const customerController = require("./customer.controller");

router.get("/", asyncHandler(customerController.getCustomers));


module.exports = router;