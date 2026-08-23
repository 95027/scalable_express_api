const { Op } = require("sequelize");
const AppError = require("../../common/errors/AppError");
const { User } = require("../../models");
const { ROLES } = require("../../common/constants/roles");

class UserService {

  static async getUserById(id) {
    const user = await User.findByPk(id, {
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  static async updateStatus(id) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.role === ROLES.ADMIN) {
      throw new AppError("Admin cannot be blocked", 400);
    }

    user.isActive = !user.isActive;

    await user.save();

    return user;
  }

  static async deleteUser(id) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.role === ROLES.ADMIN) {
      throw new AppError("Admin cannot be deleted", 400);
    }

    await user.destroy();
  }
}

module.exports = UserService;
