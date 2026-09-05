const IdentityService = require("../identity/identity.service");
const CustomerService = require("./customer.service");


exports.getCustomers = async (req, res) => {
    const result = await CustomerService.getCustomers(req.query);

    res.status(200).json({
        success: true,
        data: result.customers,
        pagination: result.pagination,
    });
}

exports.createCustomer = async (req, res) => {
    const customer = await CustomerService.createCustomer(req.validated);

    res.status(201).json({
        success: true,
        data: customer,
    });
};