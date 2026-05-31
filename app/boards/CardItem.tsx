"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "../data/types"; // اگر Card اینجا تعریف شده

type CardItemProps = {
  card: Card;
  columnId: string;
  onDelete: (columnId: string, cardId: string) => void;
};

export default function CardItem({ card, columnId, onDelete }: CardItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: card.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded shadow relative cursor-grab active:cursor-grabbing"
    >
      {card.title}

      <button
        onClick={() => onDelete(columnId, card.id)}
        className="absolute top-1 right-1 text-xs text-red-500"
      >
        X
      </button>
    </div>
  );
}
