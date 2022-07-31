import { handleLogout } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await handleLogout(req, res);
  } catch (error: any) {
    res.status(error.status || 400).end(error.message);
  }
}
