import { socket } from "@/services/socket";
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

export function createNewNode(type: string, data: any) {
  const middleX = window.innerWidth / 2;
  const middleY = window.innerHeight / 2;

  const newNode = {
    id: `${Math.random()}`,
    type: type,
    position: {
      x: middleX,
      y: middleY,
    },
    data: data,
  };
  
  socket.emit("nodeEvent", newNode);
}

export function removeDuplicates(nodes:any) {
  const uniqueNodes = nodes.filter((node:any, index:any) => {
    const _node = JSON.stringify(node);
    return (
      index ===
      nodes.findIndex((obj:any) => {
        return JSON.stringify(obj) === _node;
      })
    );
  });
  return uniqueNodes;
}
