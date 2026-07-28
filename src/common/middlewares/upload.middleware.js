const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');
const crypto = require('crypto');

const uploadMiddleware = ({ destination = "files", maxFileSize = 500 * 1024 * 1024 } = {}) => {

    return (req, res, next) => {

        const contentType = req.headers["content-type"];

        if (!contentType?.startsWith("multipart/form-data")) {
            return res.status(400).json({
                success: false,
                message: "Content-Type must be multipart/form-data",
            })
        }

        const busboy = Busboy({
            headers: req.headers,
            limits: {
                fileSize: maxFileSize,
            }
        });

        const fields = {};
        const files = [];

        const uploadPromises = [];
        const actualPaths = [];

        let hasFileTooLarge = false;

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

            actualPaths.push(actualPath);

            file.on("limit", () => {
                hasFileTooLarge = true;
            });

            const writeStream = fs.createWriteStream(actualPath);

            files.push({ fieldName, filename: uniqueName, mimeType: info.mimeType, path: storedPath });

            const uploadPromise = pipeline(file, writeStream);

            uploadPromises.push(uploadPromise);
        });

        busboy.on("finish", async () => {
            try {
                await Promise.all(uploadPromises);

                if (files.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: "No files or fields were uploaded.",
                    });
                }

                if (hasFileTooLarge) {
                    await cleanupFiles(actualPaths);
                    return res.status(413).json({
                        success: false,
                        message: "One or more files exceed the maximum allowed size.",
                    });
                }
                req.body = fields;
                req.files = files;
                next();
            } catch (error) {
                await cleanupFiles(actualPaths);
                next(error);
            }
        });

        busboy.on("error", async (error) => {
            await cleanupFiles(actualPaths);
            next(error);
        });

        req.pipe(busboy);

    }
}

const cleanupFiles = async (filepaths) => {
    await Promise.all(filepaths.map((path) => fs.promises.rm(path, { force: true })));
}

module.exports = uploadMiddleware;