import aws from 'aws-sdk';
import crypto from "crypto";

export const s3Upload = async (file: Express.Multer.File) => {
    aws.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });

    const s3 = new aws.S3();

    const hash = crypto.randomBytes(6).toString('hex');
    const filename = `${hash}_${file.originalname}`;

    var params = {
      Bucket: process.env.AWS_BUCKET_NAME || '',
      Key: `uploads/${filename}`,
      Body: file.buffer
    };

    return await s3.upload(params).promise()
}

export const s3Delete = async (image: any) => {
    aws.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });

    const s3 = new aws.S3();

    console.log('first', image.path.split('uploads/')[1])

    var params = {
      Bucket: process.env.AWS_BUCKET_NAME || '',
      Key: `uploads/${image.path.split('uploads/')[1]}`
    };

    return await s3.deleteObject(params).promise()
}