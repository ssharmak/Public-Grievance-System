import multer from "multer";
import s3Client from "../config/s3Client.js";
import multerS3 from "multer-s3";
import path from "path";

// Configure AWS S3 - using shared client
const s3 = s3Client;

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        "grievances/" +
          file.fieldname +
          "-" +
          uniqueSuffix +
          path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images and PDFs are allowed."), false);
    }
  },
});

export default upload;
