import {
  getAccessToken,
  getSession,
  withApiAuthRequired,
} from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import prismaClient from "../../../lib/prisma";
import { getUserIdFromAuth0 } from "../../../utils";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;
  const session = getSession(req, res);
  const userId = getUserIdFromAuth0(session!);

  switch (method) {
    case "POST":
      try {
        const createdPost = await prismaClient.post.create({
          data: {
            title: body.title,
            body: body.body,
            authorId: userId,
            tags: body.tags,
          },
          include: {
            likes: true,
          },
        });
        res.status(201).json(createdPost);
      } catch (error) {
        console.error(error);
        res.status(500).json(error);
      }
      break;
    default:
      res.status(500).json({ error: "Method not allowed" });
      break;
  }
});
