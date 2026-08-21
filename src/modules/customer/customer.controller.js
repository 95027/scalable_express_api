const CustomerService = require("./customer.service");


exports.getCustomers = async (req, res) => {
    const result = await CustomerService.getCustomers(req.query);

    res.status(200).json({
        success: true,
        data: result.customers,
        pagination: result.pagination,
    });
}