const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const s3Client = require('../utils/s3');
const logger = require('../utils/logger');

class UploadService {
    async uploadFile(file) {
        const bucketName = process.env.S3_BUCKET || 'troudo-files';
        const key = `uploads/${uuidv4()}-${file.originalname}`;

        try {
            const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            });

            await s3Client.send(command);

            // Construct URL (In production this would be behind a CDN or MinIO public endpoint)
            // Since MinIO is internal to Docker, we might need a public endpoint for the browser
            const publicUrl = `${process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT}/${bucketName}/${key}`;

            logger.info(`✅ File uploaded to S3: ${key}`);
            return publicUrl;
        } catch (err) {
            logger.error('❌ S3 Upload Error:', err);
            throw new Error('FILE_UPLOAD_FAILED');
        }
    }
}

module.exports = new UploadService();
