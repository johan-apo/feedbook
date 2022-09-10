import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import {
  deletePostById,
  getLikeByAuthorIdAndPostId,
  likeOrDislikePost,
} from "../../../prisma/queries";
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
    // Like and unlike the post
    case "PATCH":
      try {
        if (postId && typeof postId == "string") {
          const retrievedLike = await getLikeByAuthorIdAndPostId({
            authorId: currentAuthenticatedUser,
            postId,
          });

          const postIsLiked = retrievedLike != null;
          if (postIsLiked) {
            const result = await likeOrDislikePost({
              postId,
              idFromLike: retrievedLike.id,
            });

            res.status(200).json(result);
          } else {
            const result = await likeOrDislikePost({
              postId,
              idFromUser: currentAuthenticatedUser,
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
          const result = await deletePostById(postId);
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
