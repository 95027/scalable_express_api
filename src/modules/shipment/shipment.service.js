const { SHIPMENT_STATUS } = require("../../common/constants/shipment.constants");
const AppError = require("../../common/errors/AppError");
const { generateShipmentCode } = require("../../common/utils/shipmentCode");
const sequelize = require("../../config/db");
const { Customer, Shipment, ShipmentAddress, ShipmentPackage } = require("../../models");


class ShipmentService {

    static async createShipment(data, userId) {

        const { customerId, package: packageData, pickup, delivery } = data;

        const customer = await Customer.findByPk(customerId);

        if (!customer) {
            throw new AppError("Customer not found", 404);
        }

        const shipmentCode = generateShipmentCode();

        const transaction = await sequelize.transaction();

        try {

            const shipment = await Shipment.create({ shipmentCode, customerId, status: SHIPMENT_STATUS.CREATED, createdBy: userId }, { transaction });

            await Promise.all([
                ShipmentAddress.create({
                    shipmentId: shipment.id,
                    type: "PICKUP",
                    ...pickup,
                }, { transaction }),
                ShipmentAddress.create({
                    shipmentId: shipment.id,
                    type: "DELIVERY",
                    ...delivery,
                }, { transaction }),
                ShipmentPackage.create({
                    shipmentId: shipment.id,
                    ...packageData,
                }, { transaction })
            ]);

            await transaction.commit();
            return shipment;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }

    }

    static async getAllShipments(query) {

    }

}

module.exports = ShipmentService;