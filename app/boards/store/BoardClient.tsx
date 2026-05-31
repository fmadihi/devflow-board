"use client";

import { useEffect } from "react";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useBoardStore } from "./boardStore";
import { Board } from "@/app/data/types";
import { useBoardSocket } from "./useBoardSocket";
import Column from "../Column";
import AddColumn from "../AddColumn";


export default function BoardClient({ initialBoard }: { initialBoard: Board }) {
  const setBoard = useBoardStore(s => s.setBoard);
  const board = useBoardStore(s => s.board);

  const addColumn = useBoardStore(s => s.addColumn);
  const deleteColumn = useBoardStore(s => s.deleteColumn);
  const addCard = useBoardStore(s => s.addCard);
  const deleteCard = useBoardStore(s => s.deleteCard);
  const moveColumn = useBoardStore(s => s.moveColumn);
  const moveCard = useBoardStore(s => s.moveCard);

  // boot socket server (مهم برای Next)
  useEffect(() => {
    fetch("/api/socket");
  }, []);

  const loadBoard = useBoardStore(s => s.loadBoard); 
useEffect(() => {
  loadBoard(initialBoard.id, initialBoard);
}, [loadBoard, initialBoard.id, initialBoard]);

  useBoardSocket(initialBoard.id);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  if (!board) return null;

function handleDragEnd(event: any) {
  const { active, over } = event;
  if (!over) return;

  const boardNow = useBoardStore.getState().board; // مهم: آخرین state
  if (!boardNow) return;

  const activeId = String(active.id);
  const overId = String(over.id);

  const isColumnDrag =
    boardNow.columns.some(c => c.id === activeId) &&
    boardNow.columns.some(c => c.id === overId);

  if (isColumnDrag) {
    moveColumn({
      boardId: boardNow.id,
      activeColumnId: activeId,
      overColumnId: overId,
    });
    return;
  }

  const fromColumn = boardNow.columns.find(col => col.cards.some(c => c.id === activeId));
  if (!fromColumn) return;

  const toColumnByCard = boardNow.columns.find(col => col.cards.some(c => c.id === overId));
  const toColumnByColumnId = boardNow.columns.find(col => col.id === overId);
  const toColumn = toColumnByCard ?? toColumnByColumnId;
  if (!toColumn) return;

  if (toColumnByColumnId) {
    moveCard({
      boardId: boardNow.id,
      activeCardId: activeId,
      fromColumnId: fromColumn.id,
      toColumnId: toColumn.id,
      overIndex: toColumn.cards.length,
    });
    return;
  }

  moveCard({
    boardId: boardNow.id,
    activeCardId: activeId,
    fromColumnId: fromColumn.id,
    toColumnId: toColumn.id,
    overCardId: overId,
  });
}


  return (
    <>
    <div className="p-6">
      <h1 className="text-2xl font-bold">{initialBoard.title}</h1>
      <p className="text-gray-500">Board ID: {initialBoard.id}</p>
    </div>
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={board.columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
        <div className="flex gap-6 overflow-x-auto p-6">
          {board.columns.map(col => (
            <Column
              key={col.id}
              column={col}
              onAddCard={(columnId, text) => addCard(columnId, text)}
              onDeleteCard={(columnId, cardId) => deleteCard(columnId, cardId)}
              onDeleteColumn={(columnId) => deleteColumn(columnId)}
              // مهم: برای drop روی ستون خالی، داخل Column باید یک droppable area داشته باشی
            />
          ))}
          <AddColumn onAdd={(title) => addColumn(title)} />
        </div>
      </SortableContext>
    </DndContext>
    </>
  );
}
