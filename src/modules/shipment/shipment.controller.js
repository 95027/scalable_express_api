const ShipmentService = require("./shipment.service")


exports.createShipment = async (req, res) => {

    const shipment = await ShipmentService.createShipment(req.validated, req.user.id, req.idempotencyKey);

    res.status(201).json({ message: "Shipment created successfully", success: true, data: shipment });

}

exports.getAllShipments = async (req, res) => {

    const { shipments, pagination } = await ShipmentService.getAllShipments(req.query);

    res.status(200).json({ success: true, data: shipments, pagination })

}