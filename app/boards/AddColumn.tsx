type AddColumnProps = {
  onAdd: (title: string) => void;
};

export default function AddColumn({ onAdd }: AddColumnProps) {
  return (
    <button
      onClick={() => {
        const title = prompt("Column title");
        if (title) onAdd(title);
      }}
      className="w-72 p-4 bg-gray-200 rounded-lg hover:bg-gray-300"
    >
      + Add List
    </button>
  );
}
