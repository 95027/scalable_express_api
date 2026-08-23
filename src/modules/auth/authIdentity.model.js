const sequelize = require("../../config/db");
const { DataTypes } = require("sequelize");

const AuthIdentity = sequelize.define(
    "AuthIdentity",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        providerType: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },

        providerName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        issuer: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },

        providerSubject: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        loginAttempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },

        lockUntil: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        passwordChangedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },

        isPrimary: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },

        lastUsedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "auth_identities",
        underscored: true,
        timestamps: true,
    }
);

AuthIdentity.associate = (models) => {
    AuthIdentity.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user"
    });

};

module.exports = AuthIdentity;