import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

export default withApiAuthRequired(async function shows(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getAccessToken(req, res);
    res.status(200).json(session);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
