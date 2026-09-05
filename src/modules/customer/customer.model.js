const sequelize = require("../../config/db");
const { DataTypes } = require("sequelize");

const Customer = sequelize.define(
    "Customer",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
        },

        customerCode: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: "customers",
        underscored: true,
        timestamps: true,
        paranoid: true,
    },
);

Customer.associate = (models) => {
    Customer.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
    });
};

module.exports = Customer;