import { NextApiRequest, NextApiResponse } from "next";
import { getUsersByUsername } from "../../../prisma/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;

  if (query.username == undefined) {
    query.username = "";
  }

  const username = Array.isArray(query.username)
    ? query.username[0]
    : query.username;

  switch (method) {
    case "GET":
      try {
        const result = await getUsersByUsername(username);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json(error);
      }
      break;
    default:
      break;
  }
}
