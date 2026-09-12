const Customer = require("../modules/customer/customer.model");
const IdempotencyKey = require("../modules/idempotency/idempotencykey.model");
const AuthIdentity = require("../modules/identity/authIdentity.model");
const Shipment = require("../modules/shipment/models/shipment.model");
const ShipmentAddress = require("../modules/shipment/models/shipmentAddress.model");
const ShipmentPackage = require("../modules/shipment/models/shipmentPackage.model");
const User = require("../modules/user/user.model");

const db = {
  User,
  AuthIdentity,
  Customer,
  Shipment,
  ShipmentAddress,
  ShipmentPackage,
  IdempotencyKey,
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
