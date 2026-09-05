const { z } = require("zod");

exports.loginSchema = z.object({
  email: z.string().email({
    message: "Please enter valid email",
  }),

  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});