import { Location } from "@/app/generated/prisma";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableItem({ item }: { item: Location }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="p-4 border rounded-md flex justify-between items-center hover:shadow transition-shadow"
    >
      <div>
        <h4 className="font-medium text-gray-800"> {item.locationTitle}</h4>
        <p className="text-sm text-gray-500 truncate max-w-xs">{`Latitude ${item.lat}, Langitude ${item.lng}`}</p>
      </div>
      <div className="text-sm text-gray-600">Day {item.order}</div>
    </div>
  );
}
