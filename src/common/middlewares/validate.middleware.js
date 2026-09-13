const { ZodError } = require("zod");

module.exports = (schema, source = "body") => (req, res, next) => {
  try {
    req.validated = schema.parse(req[source]);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
    next(error);
  }
};
