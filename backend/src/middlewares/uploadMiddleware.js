/**
 * @module uploadMiddleware
 * Configuración de subida de archivos para avatares, clubs y courts.
 * Exporta tres instancias multer: uploadAvatar, uploadClub, uploadCourt.
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  cb(null, allowed.includes(file.mimetype));
};

const makeStorage = (subdir) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const dest = path.join(__dirname, `../../uploads/${subdir}`);
      try {
        fs.mkdirSync(dest, { recursive: true });
      } catch (e) {}
      cb(null, dest);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const name = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext;
      cb(null, name);
    }
  });

const limits = { fileSize: 2 * 1024 * 1024 }; // 2MB

const uploadAvatar = multer({ storage: makeStorage('avatars'), limits, fileFilter });
const uploadClub = multer({ storage: makeStorage('clubs'), limits, fileFilter });
const uploadCourt = multer({ storage: makeStorage('courts'), limits, fileFilter });

// Maintain backwards compatibility: require(...) returns the avatar uploader by default
module.exports = uploadAvatar;
module.exports.uploadAvatar = uploadAvatar;
module.exports.uploadClub = uploadClub;
module.exports.uploadCourt = uploadCourt;
module.exports.default = uploadAvatar;
