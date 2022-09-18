import type { NextApiRequest, NextApiResponse } from "next";
import { AWSS3Client } from "../../../lib/awsS3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "PUT":
      try {
        const signedUrl = await AWSS3Client.getSignedUrlForPutCommand(
          `profilePictures/${req.body.filename}`
        );
        res.status(200).json({ signedUrl });
      } catch (error) {}
      break;
    default:
      res.status(405).json("Method not allowed");
      break;
  }
}
