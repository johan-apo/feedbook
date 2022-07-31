import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import prismaClient from "../../../lib/prisma";
import { getUserIdFromAuth0 } from "../../../utils";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id: postId },
    method,
  } = req;

  const session = getSession(req, res)!;
  const currentAuthenticatedUser = getUserIdFromAuth0(session);

  switch (method) {
    case "PATCH":
      try {
        if (postId && typeof postId == "string") {
          const likeDocument = await prismaClient.like.findFirst({
            where: {
              authorId: currentAuthenticatedUser,
              postId,
            },
          });

          const thePostIsLiked = likeDocument != null;
          if (thePostIsLiked) {
            const result = await prismaClient.post.update({
              where: {
                id: postId,
              },
              data: {
                likes: {
                  delete: {
                    id: likeDocument.id,
                  },
                },
              },
              include: {
                likes: true,
              },
            });

            res.status(200).json(result);
          } else {
            const result = await prismaClient.post.update({
              where: {
                id: postId,
              },
              data: {
                likes: {
                  create: {
                    authorId: currentAuthenticatedUser,
                  },
                },
              },
              include: {
                likes: true,
              },
            });

            res.status(200).json(result);
          }
        }
      } catch (error) {
        res.status(500).json(error);
      }
      break;
    case "DELETE":
      try {
        if (postId && typeof postId == "string") {
          const result = await prismaClient.post.delete({
            where: {
              id: postId,
            },
            include: {
              likes: true,
            },
          });
          res.status(200).json(result);
        }
      } catch (error) {
        res.status(500).json(error);
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
});
