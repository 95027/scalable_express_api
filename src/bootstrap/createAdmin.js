const { AUTH_PROVIDER_TYPES, AUTH_PROVIDERS } = require("../common/constants/auth.constants");
const { ROLES } = require("../common/constants/roles");
const { User, AuthIdentity } = require("../models");
const bcrypt = require('bcrypt');

const createAdmin = async () => {

    const existing = await User.findOne({ where: { email: "admin@example.com" } });

    if (existing) {
        return;
    }

    const hashedPass = await bcrypt.hash("password", 10);

    const transaction = await User.sequelize.transaction();

    try {
        const user = await User.create({ name: "admin", email: "admin@example.com", role: ROLES.ADMIN }, { transaction });

        await AuthIdentity.create(
            {
                userId: user.id,
                providerType: AUTH_PROVIDER_TYPES.PASSWORD,
                providerName: AUTH_PROVIDERS.LOCAL,
                password: hashedPass,
                isVerified: true,
                isPrimary: true,
            },
            {
                transaction,
            }
        );

        await transaction.commit();

        console.log("Admin created...");
    } catch (error) {
        await transaction.rollback();
        throw error;
    }



}

module.exports = createAdmin;