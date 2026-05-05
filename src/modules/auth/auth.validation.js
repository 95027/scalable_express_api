const { z } = require("zod");
const roles = require("../../common/constants/roles");

const base = {
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum([roles.USER, roles.VENDOR]).optional(),
};

exports.registerSchema = z.object(base);

exports.loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
