import BoardClient from "../store/BoardClient";
import { makeInitialBoard } from "../store/mockBoard";


export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const initialBoard = makeInitialBoard(id);
  return <BoardClient initialBoard={initialBoard} />;
}
