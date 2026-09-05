const { Op } = require("sequelize");
const { User, sequelize, Customer } = require("../../models");
const { ROLES } = require("../../common/constants/roles");
const IdentityService = require("../identity/identity.service");
const { generateTempPassword } = require("../../common/utils/password");
const { generateCustomerCode } = require("../../common/utils/customerCode");
const EmailJob = require("../../jobs/email.job");


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
            customers: rows,
            pagination: {
                total: count,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(count / limitNum),
            },
        };
    }

    static async createCustomer(data) {
        const transaction = await sequelize.transaction();

        try {
            const password = generateTempPassword();
            const customerCode = generateCustomerCode();

            const { user } =
                await IdentityService.createPasswordAccount(
                    {
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        password,
                        role: ROLES.CUSTOMER,
                    },
                    transaction
                );

            const customer = await Customer.create(
                {
                    userId: user.id,
                    customerCode,
                },
                { transaction }
            );

            await transaction.commit();

            EmailJob.customerCredentialMail({
                to: user.email,
                name: user.name,
                email: user.email,
                password,
                customerCode,
            });

            return customer;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

}

module.exports = CustomerService;