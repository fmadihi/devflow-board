"use client";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CardItem from "./CardItem";
import AddCard from "./AddCard";
import { Column as ColumnType } from "../data/types";
import { useDroppable } from "@dnd-kit/core";

type ColumnProps = {
  column: ColumnType;
  onAddCard: (columnId: string, text: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onDeleteColumn: (columnId: string) => void;
};

export default function Column({
  column,
  onAddCard,
  onDeleteCard,
  onDeleteColumn,
}: ColumnProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.id });

  const { setNodeRef: setDroppableRef } = useDroppable({ id: column.id });

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
      className="bg-gray-100 w-64 p-4 rounded shadow flex-shrink-0 cursor-grab"
    >
      <div className="flex justify-between mb-4">
        <h2 className="font-bold">{column.title}</h2>

        <button
          className="text-red-500 text-sm"
          onClick={() => onDeleteColumn(column.id)}
        >
          X
        </button>
      </div>

      <div ref={setDroppableRef} className="flex flex-col gap-3  min-h-6">
        <SortableContext
          items={column.cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              columnId={column.id}
              onDelete={onDeleteCard}
            />
          ))}
        </SortableContext>
      </div>

      <AddCard columnId={column.id} onAddCard={onAddCard} />
    </div>
  );
}
