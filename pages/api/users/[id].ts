import { NextApiRequest, NextApiResponse } from "next";
import { getUserById, updateUsernameByUserId } from "../../../prisma/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id: userId },
    method,
    body: { username },
  } = req;

  if (!userId || typeof userId != "string") {
    res.status(400).json({ message: "Pass only one path param" });
    return;
  }

  switch (method) {
    case "GET":
      try {
        const result = await getUserById(userId);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json(error);
      }
      break;
    case "PATCH":
      try {
        const result = await updateUsernameByUserId(userId, username);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json(error);
      }
      break;
    default:
      break;
  }
}
