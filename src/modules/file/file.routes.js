const asyncHandler = require('../../common/middlewares/asyncHandler');
const fileController = require('../file/file.controller');
const { upload } = require('./file.controller');

const router = require('express').Router();

router.post("/video", asyncHandler(fileController.upload));

module.exports = router;