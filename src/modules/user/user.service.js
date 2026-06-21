const { Op } = require("sequelize");
const AppError = require("../../common/errors/AppError");
const { User } = require("../../models");
const { ROLES } = require("../../common/constants/roles");

class UserService {
  static async getUsers(query) {
    const { page = 1, limit = 10, role, isActive, search } = query;

    const where = {};

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    if (search) {
      where[Op.or] = [
        {
          name: {
            [Op.like]: `%${search}`,
          },
        },
        {
          email: {
            [Op.like]: `%${search}`,
          },
        },
      ];
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: {
        exclude: ["password"],
      },
      limit: limitNum,
      offset,
      order: ["createdAt", "DESC"],
    });

    return {
      users: rows,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    };
  }

  static async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
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

    if (user.id === id) {
      throw new AppError("You cannot block yourself", 400);
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
