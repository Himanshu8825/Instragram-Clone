const dataUri = require('datauri/parser.js');

const path = require('path');

const parser = new dataUri.Parser();

const getDataUri = (file)=>{
    const buffer = fs.readFileSync(file.path);
    const extName = path.extname(file.originalname).toLowerCase();
    return parser.format(ext, buffer);
}

module.exports = getDataUri;
