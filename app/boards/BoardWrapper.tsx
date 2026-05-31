"use client";

import Board from "./Board";

const columns = [
  { id: "1", title: "Todo", cards: [] },
  { id: "2", title: "In Progress", cards: [] },
  { id: "3", title: "Done", cards: [] }
];
export default function BoardWrapper() {
  return <Board columns={columns} />;
}
