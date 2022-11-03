// @ts-nocheck
import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

export default async function socketHandler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      socket.on("input-change", (msg) => {
        socket.broadcast.emit("update-input", msg);
      });
      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
// TODO: FINISH CHAT FEATURE
