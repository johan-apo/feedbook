import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class AWSS3Client {
  private static CLIENT = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  static getSignedUrlForPutCommand(
    key: string,
    bucket: string = process.env.S3_BUCKET!,
    expiresIn: number = 60
  ) {
    return getSignedUrl(
      this.CLIENT,
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
      { expiresIn }
    );
  }

  static deleteProfilePictureByFilename(
    filename: string,
    bucket: string = process.env.S3_BUCKET!
  ) {
    return this.CLIENT.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: `profilePictures/${filename}`,
      })
    );
  }
}
