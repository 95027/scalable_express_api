const { z } = require("zod");

exports.getShipmentsSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().trim().max(100).optional(),
    status: z.enum([
        "CREATED",
        "CONFIRMED",
        "PICKED_UP",
        "IN_TRANSIT",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
    ]).optional(),
});

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