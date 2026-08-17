// ============================================================
// Middleware: File Upload (Multer)
// ============================================================

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
const { ALLOWED_UPLOAD_TYPES, MAX_FILE_SIZE } = require('../config/constants');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const folder = req.uploadFolder || 'general';
    const dir = path.join(__dirname, '../../uploads', folder);
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext    = path.extname(file.originalname).toLowerCase();
    cb(null, `${unique}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_UPLOAD_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed. Allowed: ${ALLOWED_UPLOAD_TYPES.join(', ')}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

module.exports = upload;
