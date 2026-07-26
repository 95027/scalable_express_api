const env = require("../../config/env");

const getFileUrl = (filepath) => {

    if (!filepath) return null;

    return `${env.fileBaseUrl}/uploads/${filepath}`;

}

module.exports = getFileUrl;