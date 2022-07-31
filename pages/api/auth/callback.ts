import { handleCallback } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await handleCallback(req, res);
  } catch (error: any) {
    res.status(error.status || 400).end(error.message);
  }
}
