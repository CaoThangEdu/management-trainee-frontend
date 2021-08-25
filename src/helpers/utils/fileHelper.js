export default {
    /**
     * Get extension of file (.doc, .txt ...)
     * @param {String} path File path
     */
    getFileName(path) {
        if (!path) {
            return '';
        }
        path = path.replace(/\\/g, '/');
        return path.split('/').pop();
    },
    /**
     * Get extension of file (.doc, .txt ...)
     * @param {String} fileName File name
     */
    getExtensionFile(fileName) {
        if (!fileName || fileName.indexOf('.') == -1) {
            return '';
        }
        return fileName.split('.').pop();
    },

    /**
     * Validate file.
     *    0: file is null, -1: size to large, -2: extension of file is invalid , 1: File is OK
     * @param {Object} file File
     */
    checkFile: function (file, extensionAllowed, maxSize) {
        if (file == null) {
            return 0;
        }
        //var sExtension = s.name.replace(/^.*\./, '').toLowerCase();
        var sExtension = this.getExtensionFile(file.name).toLowerCase();
        if (extensionAllowed.indexOf(sExtension) === -1) {
            return -2;
        }
        if (file.size >= maxSize) {
            return -1;
        }
        return 1;
    },

    /**
     * Get icon Awesome by extension
     * @param {String} strExtension Extension of file
     */
    getExtensionIcon(strExtension) {

        var icon = 'fa-file-text-o';
        switch (strExtension.toLowerCase()) {
            case 'heic':
            case 'png':
            case 'gif':
            case 'bmp':
            case 'jpg':
            case "jpeg":
                icon = 'fa-file-image-o';
                break;
            case 'pdf':
                icon = 'fa-file-pdf-o';
                break;
            case 'doc':
            case 'docx':
                icon = 'fa-file-word-o';
                break;
            case 'xls':
            case 'csv':
            case 'xlsx':
                icon = 'fa-file-excel-o';
                break;
        }
        return icon;

    }

}