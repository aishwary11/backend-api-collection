import AWS from 'aws-sdk';

AWS.config.update({});

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.ACCESSKEY!,
    secretAccessKey: process.env.S3SECRETKEY!,
  },
});

// let fileContent =
const uploadParams = { Bucket: 'BUCKET_NAME', Key: '', Body: '' };
s3.upload(uploadParams, (err: any, data: any) => {});
export default s3;
