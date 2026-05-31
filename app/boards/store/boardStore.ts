// import { Board, Column, MoveCardPayload, MoveColumnPayload } from "@/app/data/types";
// import { create } from "zustand";

// function arrayMove<T>(arr: T[], from: number, to: number) {
//   const copy = [...arr];
//   const [item] = copy.splice(from, 1);
//   copy.splice(to, 0, item);
//   return copy;
// }

// type BoardState = {
//   board: Board | null;
//   setBoard: (b: Board) => void;

//   addColumn: (title: string) => Column;
//   deleteColumn: (columnId: string) => void;

//   addCard: (columnId: string, title: string) => { id: string; title: string };
//   deleteCard: (columnId: string, cardId: string) => void;

//   moveColumn: (p: MoveColumnPayload) => void;
//   moveCard: (p: MoveCardPayload) => void;

//   applyRemote: (nextBoard: Board) => void;
// };

// export const useBoardStore = create<BoardState>((set, get) => ({
//   board: null,
//   setBoard: (b) => set({ board: b }),

//   applyRemote: (nextBoard) => set({ board: nextBoard }),

//   addColumn: (title) => {
//     const board = get().board;
//     if (!board) throw new Error("No board");
//     const col: Column = { id: crypto.randomUUID(), title, cards: [] };
//     set({ board: { ...board, columns: [...board.columns, col] } });
//     return col;
//   },

//   deleteColumn: (columnId) => {
//     const board = get().board;
//     if (!board) return;
//     set({ board: { ...board, columns: board.columns.filter(c => c.id !== columnId) } });
//   },

//   addCard: (columnId, title) => {
//     const board = get().board;
//     if (!board) throw new Error("No board");
//     const newCard = { id: crypto.randomUUID(), title };

//     set({
//       board: {
//         ...board,
//         columns: board.columns.map(col =>
//           col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
//         ),
//       },
//     });

//     return newCard;
//   },

//   deleteCard: (columnId, cardId) => {
//     const board = get().board;
//     if (!board) return;
//     set({
//       board: {
//         ...board,
//         columns: board.columns.map(col =>
//           col.id === columnId
//             ? { ...col, cards: col.cards.filter(c => c.id !== cardId) }
//             : col
//         ),
//       },
//     });
//   },

//   moveColumn: ({ activeColumnId, overColumnId }) => {
//     const board = get().board;
//     if (!board) return;

//     const from = board.columns.findIndex(c => c.id === activeColumnId);
//     const to = board.columns.findIndex(c => c.id === overColumnId);
//     if (from < 0 || to < 0 || from === to) return;

//     set({ board: { ...board, columns: arrayMove(board.columns, from, to) } });
//   },

//   moveCard: ({ activeCardId, fromColumnId, toColumnId, overCardId, overIndex }) => {
//     const board = get().board;
//     if (!board) return;

//     const fromCol = board.columns.find(c => c.id === fromColumnId);
//     const toCol = board.columns.find(c => c.id === toColumnId);
//     if (!fromCol || !toCol) return;

//     const fromIndex = fromCol.cards.findIndex(c => c.id === activeCardId);
//     if (fromIndex < 0) return;

//     const moving = fromCol.cards[fromIndex];

//     // remove from source
//     let nextColumns = board.columns.map(col => {
//       if (col.id !== fromColumnId) return col;
//       return { ...col, cards: col.cards.filter(c => c.id !== activeCardId) };
//     });

//     // insert to target
//     const target = nextColumns.find(c => c.id === toColumnId)!;
//     const insertAt =
//       typeof overIndex === "number"
//         ? overIndex
//         : overCardId
//           ? Math.max(0, target.cards.findIndex(c => c.id === overCardId))
//           : target.cards.length;

//     const nextTargetCards = [...target.cards];
//     nextTargetCards.splice(insertAt < 0 ? nextTargetCards.length : insertAt, 0, moving);

//     nextColumns = nextColumns.map(col =>
//       col.id === toColumnId ? { ...col, cards: nextTargetCards } : col
//     );

//     set({ board: { ...board, columns: nextColumns } });
//   },
// }));
import { Board, Column, MoveCardPayload, MoveColumnPayload } from "@/app/data/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

function arrayMove<T>(arr: T[], from: number, to: number) {
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

type BoardState = {
  board: Board | null;

  // ذخیره همه بردها با کلید id
  boardsById: Record<string, Board>;

  // وقتی وارد /boards/[id] شدی این را صدا بزن
  loadBoard: (id: string, fallback: Board) => void;

  setBoard: (b: Board) => void;

  addColumn: (title: string) => Column;
  deleteColumn: (columnId: string) => void;

  addCard: (columnId: string, title: string) => { id: string; title: string };
  deleteCard: (columnId: string, cardId: string) => void;

  moveColumn: (p: MoveColumnPayload) => void;
  moveCard: (p: MoveCardPayload) => void;

  applyRemote: (nextBoard: Board) => void;
};

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      board: null,
      boardsById: {},

      loadBoard: (id, fallback) => {
        const existing = get().boardsById[id];
        const boardToUse = existing ?? fallback;

        set((state) => ({
          board: boardToUse,
          boardsById: { ...state.boardsById, [id]: boardToUse },
        }));
      },

      setBoard: (b) =>
        set((state) => ({
          board: b,
          boardsById: { ...state.boardsById, [b.id]: b },
        })),

      applyRemote: (nextBoard) =>
        set((state) => ({
          board: nextBoard,
          boardsById: { ...state.boardsById, [nextBoard.id]: nextBoard },
        })),

      addColumn: (title) => {
        const board = get().board;
        if (!board) throw new Error("No board");
        const col: Column = { id: crypto.randomUUID(), title, cards: [] };

        const next: Board = { ...board, columns: [...board.columns, col] };
        get().setBoard(next); // مهم: از setBoard استفاده کن تا persist هم sync شود
        return col;
      },

      deleteColumn: (columnId) => {
        const board = get().board;
        if (!board) return;

        const next: Board = { ...board, columns: board.columns.filter((c) => c.id !== columnId) };
        get().setBoard(next);
      },

      addCard: (columnId, title) => {
        const board = get().board;
        if (!board) throw new Error("No board");

        const newCard = { id: crypto.randomUUID(), title };

        const next: Board = {
          ...board,
          columns: board.columns.map((col) =>
            col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
          ),
        };

        get().setBoard(next);
        return newCard;
      },

      deleteCard: (columnId, cardId) => {
        const board = get().board;
        if (!board) return;

        const next: Board = {
          ...board,
          columns: board.columns.map((col) =>
            col.id === columnId ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) } : col
          ),
        };

        get().setBoard(next);
      },

      moveColumn: ({ activeColumnId, overColumnId }) => {
        const board = get().board;
        if (!board) return;

        const from = board.columns.findIndex((c) => c.id === activeColumnId);
        const to = board.columns.findIndex((c) => c.id === overColumnId);
        if (from < 0 || to < 0 || from === to) return;

        const next: Board = { ...board, columns: arrayMove(board.columns, from, to) };
        get().setBoard(next);
      },

      moveCard: ({ activeCardId, fromColumnId, toColumnId, overCardId, overIndex }) => {
        const board = get().board;
        if (!board) return;

        const fromCol = board.columns.find((c) => c.id === fromColumnId);
        const toCol = board.columns.find((c) => c.id === toColumnId);
        if (!fromCol || !toCol) return;

        const fromIndex = fromCol.cards.findIndex((c) => c.id === activeCardId);
        if (fromIndex < 0) return;

        const moving = fromCol.cards[fromIndex];

        // remove from source
        let nextColumns = board.columns.map((col) => {
          if (col.id !== fromColumnId) return col;
          return { ...col, cards: col.cards.filter((c) => c.id !== activeCardId) };
        });

        // insert to target
        const target = nextColumns.find((c) => c.id === toColumnId)!;
        const insertAt =
          typeof overIndex === "number"
            ? overIndex
            : overCardId
              ? Math.max(0, target.cards.findIndex((c) => c.id === overCardId))
              : target.cards.length;

        const nextTargetCards = [...target.cards];
        nextTargetCards.splice(insertAt < 0 ? nextTargetCards.length : insertAt, 0, moving);

        nextColumns = nextColumns.map((col) =>
          col.id === toColumnId ? { ...col, cards: nextTargetCards } : col
        );

        const next: Board = { ...board, columns: nextColumns };
        get().setBoard(next);
      },
    }),
    {
      name: "trello-clone-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ boardsById: state.boardsById }), // فقط این رو ذخیره کن
    }
  )
);
