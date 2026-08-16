const { Op } = require("sequelize");
const { User } = require("../../models");
const { ROLES } = require("../../common/constants/roles");


class CustomerService {

    static async getCustomers(query) {
        const { page = 1, limit = 10, isActive, search } = query;

        const where = { role: ROLES.CUSTOMER };

        if (isActive !== undefined) {
            where.isActive = isActive === "true";
        }

        if (search) {
            where[Op.or] = [
                {
                    name: {
                        [Op.like]: `%${search}%`,
                    },
                },
                {
                    email: {
                        [Op.like]: `%${search}%`,
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
            order: [["createdAt", "DESC"]],
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

}

module.exports = CustomerService;