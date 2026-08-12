const { z } = require("zod");
const { ROLES } = require("../../common/constants/roles");

const base = {
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  // role: z.enum([ROLES.CUSTOMER]).optional(),
};

exports.registerSchema = z.object(base);

exports.loginSchema = z.object({
  email: z.string().email({ message: "Please enter valid email" }),
  password: z.string().min(6, { message: "Password must be atleast 6 characters" }),
});
