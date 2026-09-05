const crypto = require("crypto");

const generateTempPassword = (length = 12) => {
    return crypto.randomBytes(length).toString("base64url").slice(0, length);
};

module.exports = {
    generateTempPassword,
};