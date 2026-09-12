const { z } = require("zod");
const AppError = require("../errors/AppError");


const idempotencyMiddleware = (req, res, next) => {

    const idempotencySchema = z.string().uuid();

    const key = req.get("Idempotency-Key");

    if (!key) {
        return next(new AppError("Idempotency-Key Header is missing", 400));
    }

    const result = idempotencySchema.safeParse(key);

    if (!result.success) {
        return next(new AppError("Invalid Idempotency-Key", 400));
    }

    req.idempotencyKey = result.data;

    next();

}


module.exports = idempotencyMiddleware;