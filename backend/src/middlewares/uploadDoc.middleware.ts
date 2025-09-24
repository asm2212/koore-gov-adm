import multer from "multer";
import path from "path";
import fs from "fs";

// Define the upload folder path
const UPLOAD_DIR = path.resolve(__dirname, "../../uploads/docs");

// Ensure the folder exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Allowed file types
const ALLOWED_MIMETYPES = [
  "application/pdf", // PDFs
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

// Multer upload middleware
export const uploadDoc = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new multer.MulterError(
          "LIMIT_UNEXPECTED_FILE",
          `Invalid file type! Allowed types: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, WEBP`
        )
      );
    }
  },
});
