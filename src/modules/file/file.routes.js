const asyncHandler = require('../../common/middlewares/asyncHandler');
const uploadMiddleware = require('../../common/middlewares/upload.middleware');
const fileController = require('../file/file.controller');

const router = require('express').Router();

router.post("/video", uploadMiddleware({ destination: "videos" }), asyncHandler(fileController.upload));

module.exports = router;