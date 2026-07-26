const FileService = require("./file.service")


exports.upload = async (req, res) => {

    const response = await FileService.upload(req.body, req.files);

    res.status(201).json({
        success: true,
        message: "file uploaded successfully...",
        data: response
    });

}