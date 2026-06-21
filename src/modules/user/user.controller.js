const UserService = require("./user.service");

exports.getAuthUser = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

exports.getUsers = async (req, res, next) => {
  const result = await UserService.getUsers(req.query);

  res.status(200).json({
    success: true,
    data: result.users,
    pagination: result.pagination,
  });
};

exports.getUserById = async (req, res, next) => {
  const user = await UserService.getUserById(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
};

exports.updateStatus = async (req, res) => {
  const user = await UserService.updateStatus(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
    message: "User status updated successfully",
  });
};

exports.deleteUser = async (req, res) => {
  await UserService.deleteUser(req.params.id);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
};
