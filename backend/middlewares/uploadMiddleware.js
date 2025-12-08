/**
 * @file uploadMiddleware.js
 * @description File Upload Middleware using Multer and AWS S3.
 * Configured to upload files directly to an S3 bucket.
 * It enforces file size limits and file type validation (Images and PDFs only).
 */

import multer from "multer";
import s3Client from "../config/s3Client.js";
import multerS3 from "multer-s3";
import path from "path";

// Configure AWS S3 - using shared client
const s3 = s3Client;

/**
 * Multer middleware configured for S3 storage.
 * 
 * - Storage: Uses `multer-s3` to upload directly to the specified S3 bucket.
 * - Key: Generates a unique key for the file using the format: `grievances/<fieldname>-<timestamp>-<random>.<ext>`.
 * - Metadata: Stores the field name as metadata.
 * - Limits: 10MB file size limit.
 * - Filter: Allows only image MIME types (`image/*`) and PDFs (`application/pdf`).
 */
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // Generate unique filename: fieldname-timestamp-random.ext
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
    // Only allow Image mime types or PDFs
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
