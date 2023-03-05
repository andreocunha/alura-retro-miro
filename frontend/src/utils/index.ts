import { GenericNode } from "@/types/interfaces";

export function convertData(data: GenericNode) {
  const newData = Object.entries(data).map(([id, cursor]) => ({
    id: id,
    type: cursor.type,
    position: {
      x: cursor.position.x,
      y: cursor.position.y,
    },
    data: cursor.data,
  }));
  return newData;
}
