const asyncHandler = require('../../common/middlewares/asyncHandler');
const idempotencyMiddleware = require('../../common/middlewares/idempotency.middleware');
const validate = require('../../common/middlewares/validate.middleware');
const router = require('express').Router();
const shipmentController = require('./shipment.controller');
const { createShipmentSchema } = require('./shipment.validation');

router.get("/", asyncHandler(shipmentController.getAllShipments));
router.post("/", idempotencyMiddleware, validate(createShipmentSchema), asyncHandler(shipmentController.createShipment));


module.exports = router;