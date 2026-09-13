const { Op, where: sequelizeWhere, col } = require("sequelize");
const { SHIPMENT_STATUS } = require("../../common/constants/shipment.constants");
const AppError = require("../../common/errors/AppError");
const { generateShipmentCode } = require("../../common/utils/shipmentCode");
const sequelize = require("../../config/db");
const { Customer, Shipment, ShipmentAddress, ShipmentPackage, IdempotencyKey, User } = require("../../models");
const { IDEMPOTENCY_OPERATION } = require("../../common/constants/idempotency.operation.constants");


class ShipmentService {

    static async createShipment(data, userId, idempotencyKey) {
        const {
            customerId,
            package: packageData,
            pickup,
            delivery,
        } = data;

        const customer = await Customer.findOne({
            where: {
                id: customerId,
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "isActive"],
                    where: {
                        isActive: true,
                    },
                },
            ],
        });

        if (!customer) {
            throw new AppError("Customer not found", 404);
        }

        const existingRecord = await IdempotencyKey.findOne({
            where: {
                key: idempotencyKey,
                operation: IDEMPOTENCY_OPERATION.CREATE_SHIPMENT,
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

        return sequelize.transaction(async (transaction) => {
            const idempotencyRecord = await IdempotencyKey.create(
                {
                    key: idempotencyKey,
                    operation: IDEMPOTENCY_OPERATION.CREATE_SHIPMENT,
                    userId,
                    status: "PROCESSING",
                },
                { transaction }
            );

            const shipment = await Shipment.create(
                {
                    shipmentCode: generateShipmentCode(),
                    customerId,
                    status: SHIPMENT_STATUS.CREATED,
                    createdBy: userId,
                },
                { transaction }
            );

            await ShipmentAddress.create(
                {
                    shipmentId: shipment.id,
                    type: "PICKUP",
                    ...pickup,
                },
                { transaction }
            );

            await ShipmentAddress.create(
                {
                    shipmentId: shipment.id,
                    type: "DELIVERY",
                    ...delivery,
                },
                { transaction }
            );

            await ShipmentPackage.create(
                {
                    shipmentId: shipment.id,
                    ...packageData,
                },
                { transaction }
            );

            await idempotencyRecord.update(
                {
                    status: "COMPLETED",
                    resourceId: shipment.id,
                },
                { transaction }
            );

            return shipment;
        });
    }

    static async getAllShipments(query) {
        const { page, limit, search, status } = query;

        const whereCondition = {};
        const offset = (page - 1) * limit;

        if (search) {
            const searchValue = `%${search}%`;

            whereCondition[Op.or] = [
                {
                    shipmentCode: {
                        [Op.like]: searchValue,
                    },
                },
                sequelizeWhere(
                    col("customer.customer_code"),
                    Op.like,
                    searchValue
                ),
                sequelizeWhere(
                    col("customer->user.name"),
                    Op.like,
                    searchValue
                ),
                sequelizeWhere(
                    col("customer->user.email"),
                    Op.like,
                    searchValue
                ),
            ];
        }

        if (status) {
            whereCondition.status = status;
        }

        const { rows, count } = await Shipment.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: Customer,
                    as: "customer",
                    attributes: ["id", "customerCode", "userId"],
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["id", "name", "email"],
                        },
                    ],
                },
            ],
            limit,
            offset,
            order: [
                ["createdAt", "DESC"],
                ["id", "DESC"],
            ],
        });

        return {
            shipments: rows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
            },
        };
    }

}

module.exports = ShipmentService;