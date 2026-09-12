const { SHIPMENT_STATUS } = require("../../common/constants/shipment.constants");
const AppError = require("../../common/errors/AppError");
const { generateShipmentCode } = require("../../common/utils/shipmentCode");
const sequelize = require("../../config/db");
const { Customer, Shipment, ShipmentAddress, ShipmentPackage, IdempotencyKey } = require("../../models");


class ShipmentService {

    static async createShipment(data, userId, idempotencyKey) {
        const {
            customerId,
            package: packageData,
            pickup,
            delivery,
        } = data;

        const customer = await Customer.findByPk(customerId);

        if (!customer) {
            throw new AppError("Customer not found", 404);
        }

        const existingRecord = await IdempotencyKey.findOne({
            where: {
                key: idempotencyKey,
                operation: "CREATE_SHIPMENT",
                userId,
            },
        });

        if (existingRecord) {
            if (existingRecord.status === "COMPLETED") {
                const shipment = await Shipment.findByPk(
                    existingRecord.resourceId
                );

                if (!shipment) {
                    throw new AppError(
                        "Shipment associated with Idempotency-Key was not found",
                        500
                    );
                }

                return shipment;
            }

            throw new AppError(
                "A request with this Idempotency-Key is already processing",
                409
            );
        }

        const shipment = await sequelize.transaction(async (transaction) => {
            const idempotencyRecord = await IdempotencyKey.create(
                {
                    key: idempotencyKey,
                    operation: "CREATE_SHIPMENT",
                    userId,
                    status: "PROCESSING",
                },
                { transaction }
            );

            const shipmentCode = generateShipmentCode();

            const shipment = await Shipment.create(
                {
                    shipmentCode,
                    customerId,
                    status: SHIPMENT_STATUS.CREATED,
                    createdBy: userId,
                },
                { transaction }
            );

            await Promise.all([
                ShipmentAddress.create(
                    {
                        shipmentId: shipment.id,
                        type: "PICKUP",
                        ...pickup,
                    },
                    { transaction }
                ),

                ShipmentAddress.create(
                    {
                        shipmentId: shipment.id,
                        type: "DELIVERY",
                        ...delivery,
                    },
                    { transaction }
                ),

                ShipmentPackage.create(
                    {
                        shipmentId: shipment.id,
                        ...packageData,
                    },
                    { transaction }
                ),
            ]);

            await idempotencyRecord.update(
                {
                    status: "COMPLETED",
                    resourceId: shipment.id,
                },
                { transaction }
            );

            return shipment;
        });

        return shipment;
    }

    static async getAllShipments(query) {

    }

}

module.exports = ShipmentService;