const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../../config/env");
const { User } = require("../../models");
const AppError = require("../../common/errors/AppError");

class Authservice {
  static async register(data) {
    const existing = await User.findOne({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError("Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      ...data,
      password: hashedPassword,
    });

    return this.generateTokens(user);
  }

  static async login(data) {
    const { email, password } = data;
    const user = await User.findOne({ where: { email } });

    if (!user) throw new AppError("User not Found", 404);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new AppError("Invalid credentials", 401);

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
