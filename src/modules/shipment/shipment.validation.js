const { z } = require("zod");

exports.createShipmentSchema = z.object({
    customerId: z.string().uuid(),

    pickup: z.object({
        addressLine1: z.string().trim().min(10).max(255),
        addressLine2: z.string().trim().max(255).optional(),
        landmark: z.string().trim().max(255).optional(),
        city: z.string().trim().min(2).max(100),
        state: z.string().trim().min(2).max(100),
        country: z.string().trim().min(2).max(100).default("India"),
        postalCode: z.string().trim().min(6).max(10),
        latitude: z.coerce.number().min(-90).max(90).optional(),
        longitude: z.coerce.number().min(-180).max(180).optional(),
    }),

    delivery: z.object({
        addressLine1: z.string().trim().min(10).max(255),
        addressLine2: z.string().trim().max(255).optional(),
        landmark: z.string().trim().max(255).optional(),
        city: z.string().trim().min(2).max(100),
        state: z.string().trim().min(2).max(100),
        country: z.string().trim().min(2).max(100).default("India"),
        postalCode: z.string().trim().min(6).max(10),
        latitude: z.coerce.number().min(-90).max(90).optional(),
        longitude: z.coerce.number().min(-180).max(180).optional(),
    }),

    package: z.object({
        packageType: z.string().trim().min(1).max(50),
        weight: z.coerce.number().positive(),
        length: z.coerce.number().positive(),
        width: z.coerce.number().positive(),
        height: z.coerce.number().positive(),
    }),
});