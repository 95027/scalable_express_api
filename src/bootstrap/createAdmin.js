const { ROLES } = require("../common/constants/roles");
const { User } = require("../models");
const bcrypt = require('bcrypt');

const createAdmin = async () => {

    const admin = await User.findOne({ where: { email: "admin@example.com" } });

    if (admin) {
        return;
    }

    const hashedPass = bcrypt.hashSync("password", 10);

    await User.create({ name: "admin", email: "admin@example.com", password: hashedPass, role: ROLES.ADMIN });

    console.log("Admin created...");

}

module.exports = createAdmin;