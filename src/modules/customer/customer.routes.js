const asyncHandler = require("../../common/middlewares/asyncHandler");
const router = require("express").Router();
const customerController = require("./customer.controller");
const validate = require("../../common/middlewares/validate.middleware");
const { createCustomerSchema } = require("./customer.validation");

router.get("/", asyncHandler(customerController.getCustomers));
router.post("/create", validate(createCustomerSchema), asyncHandler(customerController.createCustomer));


module.exports = router;