import { Board } from "@/app/data/types";

export function makeInitialBoard(id: string): Board {
  return {
    id,
    title: "My Board",
    columns: [
      { id: "todo", title: "Todo", cards: [] },
      { id: "doing", title: "In Progress", cards: [] },
      { id: "done", title: "Done", cards: [] },
    ],
  };
}
