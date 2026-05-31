"use client";

import { Board } from "@/app/data/types";
import { useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { useBoardStore } from "./boardStore";


type ServerToClientEvents = {
  "board:state": (board: Board) => void;
};

type ClientToServerEvents = {
  "board:join": (boardId: string) => void;
  "board:update": (board: Board) => void;
};

export function useBoardSocket(boardId: string) {
  const applyRemote = useBoardStore(s => s.applyRemote);
  const board = useBoardStore(s => s.board);

  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = useMemo(() => {
    // اگر جای دیگه deploy کردی، اینجا URL بده
    return io({ path: "/api/socket" });
  }, []);

  useEffect(() => {
    socket.emit("board:join", boardId);

    socket.on("board:state", (next) => {
      applyRemote(next);
    });

    return () => {
      socket.off("board:state");
      socket.disconnect();
    };
  }, [socket, boardId, applyRemote]);

  // هر وقت board تغییر کرد، state جدید را broadcast کن
  useEffect(() => {
    if (!board) return;
    if (board.id !== boardId) return;
    socket.emit("board:update", board);
  }, [socket, board, boardId]);

  return socket;
}
