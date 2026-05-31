import { Board } from "@/app/data/types";
import { NextResponse } from "next/server";
import { Server } from "socket.io";


declare global {
  // eslint-disable-next-line no-var
  var _io: Server | undefined;
  // eslint-disable-next-line no-var
  var _boards: Map<string, Board> | undefined;
}

export const dynamic = "force-dynamic";

function getIO() {
  if (!global._boards) global._boards = new Map<string, Board>();

  if (!global._io) {
    // @ts-ignore - Next runtime node server
    const io = new Server({
      path: "/api/socket",
      addTrailingSlash: false,
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      socket.on("board:join", (boardId) => {
        socket.join(boardId);

        const existing = global._boards!.get(boardId);
        if (existing) {
          socket.emit("board:state", existing);
        }
      });

      socket.on("board:update", (board) => {
        global._boards!.set(board.id, board);
        socket.to(board.id).emit("board:state", board); // فقط به بقیه
      });
    });

    global._io = io;
  }

  return global._io!;
}

// این endpoint فقط برای “boot” کردن socket server است
export async function GET() {
  getIO();
  return NextResponse.json({ ok: true });
}
