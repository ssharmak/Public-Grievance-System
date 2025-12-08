/**
 * AWS S3 Configuration
 * 
 * This file initializes the AWS S3 client using the AWS SDK v3.
 * It configures the client with region and credentials from environment variables.
 * This client is used for file operations such as uploading and deleting files in S3.
 */

import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

/**
 * The initialized AWS S3 Client.
 * Configured with Region, Access Key ID, and Secret Access Key.
 */
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default s3Client;
