import { NextApiRequest, NextApiResponse } from "next";
import { AWSS3Client } from "../../../../lib/awsS3";
import {
  getPictureByUserId,
  updatePictureByUserId,
} from "../../../../prisma/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id: userId },
    method,
    body: { picture },
  } = req;

  if (!userId || typeof userId != "string") {
    res.status(400).json({ message: "Pass only one path param" });
    return;
  }

  switch (method) {
    case "PATCH":
      try {
        const userToChangePicture = await getPictureByUserId(userId);

        const userDoesntExist = !userToChangePicture;

        if (userDoesntExist) {
          res.status(404).json({ message: "User not found" });
          break;
        }

        const userWillReplacePicture = userToChangePicture.picture != null;

        if (userWillReplacePicture) {
          // NOTE: Watch out for the non-null assertion operator
          const urlSeparatedBySlash = userToChangePicture.picture!.split("/"),
            lastIndex = urlSeparatedBySlash.length - 1,
            pictureFilename = urlSeparatedBySlash[lastIndex];
          AWSS3Client.deleteProfilePictureByFilename(pictureFilename);
        }

        const result = await updatePictureByUserId(userId, picture);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json(error);
      }
      break;
    default:
      break;
  }
}
