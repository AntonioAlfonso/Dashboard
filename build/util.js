var path = require('path');
function getMimeType(filePath) {
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.svg': 'application/image/svg+xml'
    };
    var extname = path.extname(filePath);
    return mimeTypes[extname];
}
exports.getMimeType = getMimeType;
