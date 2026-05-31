import Link from "next/link";

export default function BoardsPage() {
  const boards = [
    { id: "1", name: "Development Tasks" },
    { id: "2", name: "Marketing Roadmap" },
    { id: "3", name: "Personal Tasks" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-3xl font-semibold">Boards</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {boards.map((b) => (
          <Link
            key={b.id}
            href={`/boards/${b.id}`}
            className="p-6 border rounded-lg hover:bg-gray-50 hover:shadow-sm transition"
          >
            {b.name}
          </Link>
        ))}
      </div>

      <button className="mt-6 p-4 border rounded-lg hover:bg-gray-50">
        + Create new board
      </button>
    </div>
  );
}
