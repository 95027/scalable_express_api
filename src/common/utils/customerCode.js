const crypto = require("crypto");

const generateCustomerCode = () => {
    const random = crypto.randomInt(100000, 1000000);

    return `CUS-${random}`;
};

module.exports = {
    generateCustomerCode,
};