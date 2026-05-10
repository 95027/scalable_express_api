const { z } = require("zod");
const { ROLES } = require("../../common/constants/roles");

const base = {
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum([ROLES.USER, ROLES.VENDOR]).optional(),
};

exports.registerSchema = z.object(base);

exports.loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
