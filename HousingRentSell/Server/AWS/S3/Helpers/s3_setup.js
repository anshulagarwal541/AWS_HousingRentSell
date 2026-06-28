require('dotenv').config();
const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function uploadFile(bucketName, key, fileContent) {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileContent,
    });
    const response = await s3.send(command);
    console.log("File uploaded successfully:", response);
  } catch (err) {
    console.error("Upload error:", err);
  }
}

async function downloadFile(bucketName, imagePath) {
  try {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: imagePath });
    const response = await s3.send(command);
    console.log("File downloaded successfully");
    return response.Body; // stream
  } catch (err) {
    console.error("Download error:", err);
  }
}

async function listFiles(bucketName) {
  try {
    const command = new ListObjectsV2Command({ Bucket: bucketName });
    const response = await s3.send(command);
    console.log("Files in bucket:", response.Contents.map(obj => obj.Key));
    return response
  } catch (err) {
    console.error("List error:", err);
  }
}

const checkS3BucketConnection = async () => {
    try {
        const comand = new ListObjectsV2Command({ Bucket: process.env.AWS_S3_BUCKET_NAME });
        const res = await s3.send(comand);
        console.log("****** S3 Bucket connection successful:", res);
    }
    catch(err){
        console.error("****** S3 Connection error:", err);
    }
}

async function getPresignedUrlForImages(bucketName, key, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
    ResponseContentDisposition: "inline",   // tells browser to display
    ResponseContentType: "image/jpeg"       // or "image/png" depending on your files
  });
  return await getSignedUrl(s3, command, { expiresIn });
}

module.exports = { uploadFile, downloadFile, listFiles, checkS3BucketConnection, getPresignedUrlForImages };
