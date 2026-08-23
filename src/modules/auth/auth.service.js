const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../../config/env");
const { User, AuthIdentity } = require("../../models");
const AppError = require("../../common/errors/AppError");
const { ROLES } = require("../../common/constants/roles");
const { AUTH_PROVIDER_TYPES, AUTH_PROVIDERS } = require("../../common/constants/auth.constants");

class Authservice {
  static async register(data) {
    const { name, email, password } = data;
    const existing = await User.findOne({
      where: { email },
    });

    if (existing) {
      throw new AppError("Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const transaction = await User.sequelize.transaction();

    try {
      const user = await User.create({
        name,
        email,
        role: ROLES.CUSTOMER,
      }, {
        transaction
      });

      await AuthIdentity.create({
        userId: user.id,
        providerType: AUTH_PROVIDER_TYPES.PASSWORD,
        providerName: AUTH_PROVIDERS.LOCAL,
        password: hashedPassword,
        isVerified: false,
        isPrimary: true,
      },
        { transaction });

      await transaction.commit();

      return user.get({ plain: true });

    } catch (error) {
      await transaction.rollback();
      throw error;

    }
  }

  static async login(data) {
    const { email, password } = data;
    const user = await User.findOne({
      where: { email }, include: {
        model: AuthIdentity,
        as: "authIdentities",
        where: {
          providerType: AUTH_PROVIDER_TYPES.PASSWORD,
          providerName: AUTH_PROVIDERS.LOCAL
        },
        required: true
      }
    });

    if (!user) throw new AppError("Invalid Credentials", 401);

    const identity = user.authIdentities[0];

    if (identity.lockUntil && identity.lockUntil > new Date()) {
      throw new AppError("Account is Locked, Try Again Later", 403);
    }

    const isMatch = await bcrypt.compare(password, identity.password);

    if (!isMatch) {
      identity.loginAttempts += 1;

      if (identity.loginAttempts >= 5) {
        identity.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        identity.loginAttempts = 0;
      }

      await identity.save();
      throw new AppError("Invalid credentials", 401);
    }

    identity.loginAttempts = 0;
    identity.lockUntil = null;
    identity.lastUsedAt = new Date();

    user.lastLoginAt = new Date();

    await identity.save();
    await user.save();

    return this.generateTokens(user);
  }

  static generateTokens(user) {
    const payload = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, env.jwt.secret, {
      expiresIn: env.jwt.accessExpiresIn,
    });

    const refreshToken = jwt.sign(payload, env.jwt.refreshSecret, {
      expiresIn: env.jwt.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  static async refreshAccessToken(token) {
    if (!token) {
      throw new AppError("Un Authorized", 401);
    }
    let decoded;
    try {
      decoded = jwt.verify(token, env.jwt.refreshSecret);
    } catch (error) {
      throw new AppError("Invalid refresh token", 401);
    }
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      throw new AppError("Unauthorized", 401);
    }

    const payload = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    return jwt.sign(payload, env.jwt.secret, {
      expiresIn: env.jwt.accessExpiresIn,
    });
  }
}

module.exports = Authservice;
