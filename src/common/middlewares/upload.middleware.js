const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');
const crypto = require('crypto');

const uploadMiddleware = ({ destination = "files" } = {}) => {

    return (req, res, next) => {

        const contentType = req.headers["content-type"];

        if (!contentType?.startsWith("multipart/form-data")) {
            return res.status(400).json({
                success: false,
                message: "Content-Type must be multipart/form-data",
            })
        }

        const busboy = Busboy({
            headers: req.headers
        });

        const fields = {};
        const files = [];

        const uploadPromises = [];

        busboy.on("field", (fieldName, value) => {
            fields[fieldName] = value;
        });

        busboy.on("file", (fieldName, file, info) => {
            const uploadDir = path.join(process.cwd(), "uploads", destination);

            fs.mkdirSync(uploadDir, { recursive: true });

            const ext = path.extname(info.filename);
            const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`;

            const actualPath = path.join(uploadDir, uniqueName);
            const storedPath = `${destination}/${uniqueName}`;

            const writeStream = fs.createWriteStream(actualPath);

            files.push({ fieldName, filename: uniqueName, mimeType: info.mimeType, path: storedPath });

            const uploadPromise = pipeline(file, writeStream);

            uploadPromises.push(uploadPromise);
        });

        busboy.on("finish", async () => {
            try {
                await Promise.all(uploadPromises);
                req.body = fields;
                req.files = files;
                next();
            } catch (error) {
                next(error);
            }
        });

        busboy.on("error", next);

        req.pipe(busboy);

    }
}

module.exports = uploadMiddleware;