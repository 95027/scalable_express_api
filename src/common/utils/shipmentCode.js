const crypto = require("crypto");

const generateShipmentCode = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    const random = crypto
        .randomBytes(5)
        .toString("hex")
        .toUpperCase();

    return `SHP-${date}-${random}`;
};

module.exports = {
    generateShipmentCode
};