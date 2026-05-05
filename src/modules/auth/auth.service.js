const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../../config/env");
const { User } = require("../../models");
const AppError = require("../../common/errors/AppError");
const roles = require("../../common/constants/roles");

class Authservice {
  static async register(data) {
    const { email, password, role = roles.USER } = data;
    const existing = await User.findOne({
      where: { email },
    });

    if (existing) {
      throw new AppError("Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...data,
      password: hashedPassword,
    });

    if (role === roles.VENDOR) {
    }

    const safeUser = user.get({ plain: true });
    delete safeUser.password;

    return safeUser;
  }

  static async login(data) {
    const { email, password } = data;
    const user = await User.findOne({ where: { email } });

    if (!user) throw new AppError("User not Found", 404);

    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new AppError("Account is Locked, Try Again Later", 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        user.loginAttempts = 0;
      }

      await user.save();
      throw new AppError("Invalid credentials", 401);
    }

    user.loginAttempts = 0;
    user.lockUntil = null;
    user.lastLoginAt = new Date();

    await user.save();

    return this.generateTokens(user);
  }

  static generateTokens(user) {
    const payload = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, env.jwt.secret, { expiresIn: "15m" });

    return { accessToken };
  }
}

module.exports = Authservice;
