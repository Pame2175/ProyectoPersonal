const multer = require('multer');
const path = require('path');

// Configuración de multer para guardar imágenes en una carpeta llamada 'uploads'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public', 'images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + file.originalname;
        cb(null, uniqueSuffix);
    }
});

const upload = multer({ storage });
module.exports = upload;
