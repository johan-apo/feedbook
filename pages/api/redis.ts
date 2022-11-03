import { NextApiRequest, NextApiResponse } from "next";
import redisInstance from "../../lib/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  switch (method) {
    case "POST":
      try {
        await redisInstance.set("mykey", body.content);
        res.status(200).json({
          body: "Success",
        });
      } catch (error) {
        res.status(500).json(error);
      }
      break;
    default:
      break;
  }
}
