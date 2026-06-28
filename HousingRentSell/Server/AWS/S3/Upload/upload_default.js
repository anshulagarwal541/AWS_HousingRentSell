const { uploadFile, checkS3BucketConnection } = require('../Helpers/s3_setup');
const { images }= require('../../../Helpers/house');
const fs = require('fs');
const path = require('path');
const fetch = require("node-fetch");

const bucketName = process.env.AWS_S3_BUCKET_NAME;

async function uploadDefaultImages() {
    await checkS3BucketConnection();
    for (let i = 0; i < images.length; i++) {
        const response = await fetch(images[i]);
        const buffer = await response.buffer();
        const key = `house_images/${path.basename(images[i])}`;
        const res = await uploadFile(bucketName, key, buffer);
        console.log(`Uploaded ${images[i]} as ${key}:`, res);
    }
}

uploadDefaultImages();