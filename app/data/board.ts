"use client";
import { Column } from "./types";

export const initialBoard: Column[] = [
  {
    id: "col-1",
    title: "To Do",
    cards: [
      { id: "card-1", title: "Learn Next.js" },
      { id: "card-2", title: "Build Trello Clone" },
    ],
  },
  {
    id: "col-2",
    title: "In Progress",
    cards: [
      { id: "card-3", title: "Learn TypeScript" },
    ],
  },
  {
    id: "col-3",
    title: "Done",
    cards: [
      { id: "card-4", title: "React Hooks Practice" },
    ],
  },
];
