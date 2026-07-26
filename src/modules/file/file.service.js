const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');

class FileService {

    static async upload(req) {

        const busboy = Busboy({
            headers: req.headers
        });

        const uploadPromises = [];
        const fields = {};

        return new Promise((resolve, reject) => {

            busboy.on("field", (fieldName, value) => {
                fields[fieldName] = value;
            });

            busboy.on("file", (fieldName, file, info) => {

                const filePath = path.join(process.cwd(), "uploads", "videos", info.filename);

                const writeStream = fs.createWriteStream(filePath);

                const uploadPromise = pipeline(file, writeStream);

                uploadPromises.push(uploadPromise);

            });

            busboy.on("finish", async () => {
                try {
                    await Promise.all(uploadPromises);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            })

            busboy.on("error", reject);

            req.pipe(busboy);

        });

    }
}


module.exports = FileService;