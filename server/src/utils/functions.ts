import { NodeProps } from "../interfaces/node";
import { COLORS } from "./colors";

export function removeNaoNumeros(str: string) {
  return str.replace(/\D/g, '');
}

export function getColorById(id: string) {
  // converte o ID em um número inteiro
  const num = parseInt(removeNaoNumeros(id));

  // calcula o índice da cor usando o resto da divisão do número pelo número de cores
  let index = num % COLORS.length;
  if (isNaN(index)) {
    index = 0;
  }

  // retorna a cor correspondente ao índice
  return COLORS[index];
}

export function convertObjToArray(data: NodeProps) {
  const newData = Object.entries(data).map(([id, cursor]) => ({
    id: id,
    type: cursor.type,
    position: {
      x: cursor.position.x,
      y: cursor.position.y,
    },
    data: cursor.data,
    zIndex: cursor.zIndex,
  }));
  return newData;
}