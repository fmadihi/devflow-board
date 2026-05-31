"use client";

import { useState } from "react";
import AddColumn from "./AddColumn";
import Column from "./Column";
import { Column as ColumnType } from "../data/types";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type BoardProps = {
  columns: ColumnType[];
};

export default function Board({ columns: initialColumns }: BoardProps) {
  const [columns, setColumns] = useState(initialColumns);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  function handleAddColumn(title: string) {
    // const newColumn = {
    //   id: crypto.randomUUID(),
    //   title,
    //   cards: [],
    // };

    // setColumns((prev) => [...prev, newColumn]);
    setColumns((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, cards: [] },
    ]);
  }

  function handleAddCard(columnId: string, text: string) {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: [...col.cards, { id: crypto.randomUUID(), title: text }],
            }
          : col,
      ),
    );
  }

  function handleDeleteColumn(columnId: string) {
    setColumns((prev) => prev.filter((col) => col.id !== columnId));
  }

  function handleDeleteCard(columnId: string, cardId: string) {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.filter((card) => card.id !== cardId),
            }
          : col,
      ),
    );
  }
  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over) return;

    // آیا ستون جابه‌جا می‌شود؟
    const isColumnDrag =
      columns.some((col) => col.id === active.id) &&
      columns.some((col) => col.id === over.id);

    if (isColumnDrag) {
      const oldIndex = columns.findIndex((c) => c.id === active.id);
      const newIndex = columns.findIndex((c) => c.id === over.id);

      setColumns((prev) => arrayMove(prev, oldIndex, newIndex));
      return;
    }

    // -------- کارت‌ها (قبلی) --------
    let sourceColumn = columns.find((col) =>
      col.cards.some((c) => c.id === active.id),
    );

    let targetColumn = columns.find((col) =>
      col.cards.some((c) => c.id === over.id),
    );

    if (!sourceColumn || !targetColumn) return;

    const activeIndex = sourceColumn.cards.findIndex((c) => c.id === active.id);
    const overIndex = targetColumn.cards.findIndex((c) => c.id === over.id);

    if (sourceColumn.id !== targetColumn.id) {
      const movingCard = sourceColumn.cards[activeIndex];

      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === sourceColumn.id) {
            return {
              ...col,
              cards: col.cards.filter((c) => c.id !== active.id),
            };
          }
          if (col.id === targetColumn.id) {
            const newArr = [...col.cards];
            newArr.splice(overIndex, 0, movingCard);
            return { ...col, cards: newArr };
          }
          return col;
        }),
      );
    } else {
      setColumns((prev) =>
        prev.map((col) =>
          col.id === sourceColumn.id
            ? {
                ...col,
                cards: arrayMove(col.cards, activeIndex, overIndex),
              }
            : col,
        ),
      );
    }
    
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {/* فقط ستون‌ها در این SortableContext */}
      <SortableContext
        items={columns.map((col) => col.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex gap-6 overflow-x-auto p-6">
          {columns.map((col) => (
            <Column
              key={col.id}
              column={col}
              onAddCard={handleAddCard}
              onDeleteCard={handleDeleteCard}
              onDeleteColumn={handleDeleteColumn}
            />
          ))}

          <AddColumn onAdd={handleAddColumn} />
        </div>
      </SortableContext>
    </DndContext>
  );
}
