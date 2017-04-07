const path = require('path');



function getMimeType (filePath: string): string {
  const mimeTypes = {
    '.html' : 'text/html',
    '.js'   : 'text/javascript',
    '.css'  : 'text/css',
    '.json' : 'application/json',
    '.svg'  : 'application/image/svg+xml'
  };

  let extname: string = path.extname(filePath);

  return mimeTypes[extname];
}

exports.getMimeType = getMimeType;
