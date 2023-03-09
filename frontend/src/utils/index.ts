import { socket } from "@/services/socket";
import { GenericNode } from "@/types/interfaces";
import Swal from "sweetalert2";

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

export function createNewNode(type: string, data: any, zIndex?: number) {
  const middleX = window.innerWidth / 2 + Math.random() * 100;
  const middleY = window.innerHeight / 2 + Math.random() * 100;

  const newNode = {
    id: `${Math.random()}`,
    type: type,
    position: {
      x: middleX,
      y: middleY,
    },
    data: data,
    zIndex: zIndex || 1000,
  };
  
  socket.emit("nodeEvent", newNode);
}

export function removeDuplicates(nodes:any) {
  // remove duplicates by id
  const uniqueNodes = nodes.filter((node: any, index: number, self: any) => {
    return index === self.findIndex((t: any) => t.id === node.id);
  });
  
  return uniqueNodes;
}

export async function getUrlAlert(){
  const { value: url } = await Swal.fire({
    input: 'url',
    inputLabel: 'Digite a URL',
    inputPlaceholder: 'Digite a URL',
    showCancelButton: true,
  })
  
  if (url) {
    return url;
  }
  return null;
}