const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const IdempotencyKey = sequelize.define(
    "IdempotencyKey",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        key: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        operation: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        status: {
            type: DataTypes.ENUM("PROCESSING", "COMPLETED"),
            allowNull: false,
            defaultValue: "PROCESSING",
        },

        resourceId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
    },
    {
        tableName: "idempotency_keys",
        underscored: true,
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["user_id", "operation", "key"],
            },
        ],
    }
);

module.exports = IdempotencyKey;