const { S3Client } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT, // e.g., http://minio:9000
    region: 'us-east-1', // MinIO default
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
    forcePathStyle: true, // Required for MinIO
});

module.exports = s3Client;
