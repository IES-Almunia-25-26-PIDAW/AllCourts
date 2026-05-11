/**
 * @module uploadMiddleware
 * Configuración de subida de archivos para avatares.
 * Guarda en disco dentro de `uploads/avatars` y limita los tipos y el tamaño de imagen.
 */
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const avatarsDir = path.join(__dirname, "../../uploads/avatars");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = avatarsDir;
    try {
      fs.mkdirSync(dest, { recursive: true });
    } catch (e) {}
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name =
      Date.now() + "-" + Math.random().toString(36).slice(2, 8) + ext;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  cb(null, allowed.includes(file.mimetype));
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter,
});

module.exports = upload;
