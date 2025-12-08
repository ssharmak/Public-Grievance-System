/**
 * Multer File Upload Configuration
 * 
 * This file configures Multer for handling file uploads.
 * It defines the storage engine, separating where files are stored (locally in 'uploads' directory)
 * and how files are named (using a timestamp and random number to ensure uniqueness).
 * 
 * Note: This configuration is primarily for local storage or temporary handling before upload to cloud.
 */

import multer from "multer";
import path from "path";
import fs from "fs";

// Directory where uploaded files will be stored locally
const uploadDir = "uploads";

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/**
 * Disk storage engine configuration for Multer.
 * 
 * - destination: Sets the folder where files will be saved.
 * - filename: Generates a unique filename for each uploaded file.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

/**
 * Multer upload middleware instance.
 * Use this to handle `multipart/form-data` requests.
 */
export const upload = multer({ storage });
