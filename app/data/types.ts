export type Card = { id: string; title: string };
export type Column = { id: string; title: string; cards: Card[] };
export type Board = { id: string; title: string; columns: Column[] };

export type MoveCardPayload = {
  boardId: string;
  activeCardId: string;
  fromColumnId: string;
  toColumnId: string;
  overCardId?: string; // اگر روی یک کارت دراپ شد
  overIndex?: number; // اگر روی ستون خالی دراپ شد
};

export type MoveColumnPayload = {
  boardId: string;
  activeColumnId: string;
  overColumnId: string;
};
