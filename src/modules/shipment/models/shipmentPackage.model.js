const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db");

const ShipmentPackage = sequelize.define(
    "ShipmentPackage",
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

        packageType: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        weight: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },

        length: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },

        width: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },

        height: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    },
    {
        tableName: "shipment_packages",
        underscored: true,
        timestamps: true,
    }
);

ShipmentPackage.associate = (models) => {
    ShipmentPackage.belongsTo(models.Shipment, {
        foreignKey: "shipmentId",
        as: "shipment",
    });
};

module.exports = ShipmentPackage;