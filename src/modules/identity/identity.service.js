const { AUTH_PROVIDER_TYPES, AUTH_PROVIDERS } = require("../../common/constants/auth.constants");
const AppError = require("../../common/errors/AppError");
const { User, AuthIdentity } = require("../../models");
const bcrypt = require("bcrypt");


class IdentityService {
    static async createPasswordAccount(data, transaction) {
        const { name, email, password, phone, role } = data;

        const existing = await User.findOne({
            where: { email },
            transaction,
        });

        if (existing) {
            throw new AppError("Email already exists", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create(
            {
                name,
                email,
                role,
                phone,
            },
            { transaction }
        );

        await AuthIdentity.create(
            {
                userId: user.id,
                providerType: AUTH_PROVIDER_TYPES.PASSWORD,
                providerName: AUTH_PROVIDERS.LOCAL,
                password: hashedPassword,
                isVerified: false,
                isPrimary: true,
            },
            { transaction }
        );

        return { user };
    }
}


module.exports = IdentityService;