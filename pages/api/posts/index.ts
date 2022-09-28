import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { createPost } from "../../../prisma/queries";
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
        const createdPost = await createPost({
          title: body.title,
          body: body.body,
          authorId: userId,
          tags: body.tags,
        });
        res.status(201).json(createdPost);
      } catch (error) {
        res.status(500).json(error);
      }
      break;
    default:
      res.status(500).json({ error: "Method not allowed" });
      break;
  }
});
