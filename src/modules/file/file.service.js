const fs = require('fs');
const path = require('path');
const getFileUrl = require('../../common/utils/file.util');

class FileService {

    static async upload(fields, files) {

        // db logic

        const mappedFiles = files.map((file) => {
            return getFileUrl(file.path);
        });


        return {
            fields, files: mappedFiles
        }

    }
}


module.exports = FileService;