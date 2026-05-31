type AddCardProps = {
  columnId: string;
  onAddCard: (columnId: string, text: string) => void;
};

export default function AddCard({ columnId, onAddCard }: AddCardProps) {
  return (
    <button
      onClick={() => {
        const text = prompt("Card text");
        if (text) onAddCard(columnId, text);
      }}
      className="text-sm text-gray-500 hover:text-black mt-2"
    >
      + Add card
    </button>
  );
}
