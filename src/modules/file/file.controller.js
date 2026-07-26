const FileService = require("./file.service")


exports.upload = async (req, res) => {

    const file = await FileService.upload(req);

    res.status(201).json({
        success: true,
        message: "file uploaded successfully...",
        data: file
    });

}