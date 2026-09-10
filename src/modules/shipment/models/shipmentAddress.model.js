const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db");

const ShipmentAddress = sequelize.define(
    "ShipmentAddress",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        shipmentId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        type: {
            type: DataTypes.ENUM("PICKUP", "DELIVERY"),
            allowNull: false,
        },

        addressLine1: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        addressLine2: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },

        landmark: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },

        city: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        state: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        country: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: "India",
        },

        postalCode: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },

        latitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true,
        },

        longitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true,
        },
    },
    {
        tableName: "shipment_addresses",
        underscored: true,
        timestamps: true,
    }
);

ShipmentAddress.associate = (models) => {
    ShipmentAddress.belongsTo(models.Shipment, {
        foreignKey: "shipmentId",
        as: "shipment",
    });
};

module.exports = ShipmentAddress;