const { z } = require("zod");

exports.createCustomerSchema = z.object({
    name: z.string().min(3, { message: "Name should be atleast 3 chars" }),
    email: z.string().email({
        message: "Please enter valid email",
    }),
    phone: z.string().optional(),
});