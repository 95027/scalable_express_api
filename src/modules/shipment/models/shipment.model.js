const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db");

const Shipment = sequelize.define(
    "Shipment",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        shipmentCode: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },

        customerId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        status: {
            type: DataTypes.ENUM(
                "CREATED",
                "CONFIRMED",
                "PICKED_UP",
                "IN_TRANSIT",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "CANCELLED"
            ),
            allowNull: false,
            defaultValue: "CREATED",
        },

        createdBy: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    },
    {
        tableName: "shipments",
        underscored: true,
        timestamps: true,
        paranoid: true,
    }
);

Shipment.associate = (models) => {
    Shipment.belongsTo(models.Customer, {
        foreignKey: "customerId",
        as: "customer",
    });

    Shipment.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "creator",
    });

    Shipment.hasMany(models.ShipmentAddress, {
        foreignKey: "shipmentId",
        as: "addresses",
    });

    Shipment.hasMany(models.ShipmentPackage, {
        foreignKey: "shipmentId",
        as: "packages",
    });
};

module.exports = Shipment;