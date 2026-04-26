const { ZodError } = require("zod");

module.exports = (schema) => (req, res, next) => {
  try {
    req.validated = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.issues.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      });
    }
    next(error);
  }
};
