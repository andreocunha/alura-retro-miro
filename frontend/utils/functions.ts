import { COLORS } from "@/styles/colors";

export function removeNaoNumeros(str: string) {
  return str.replace(/\D/g, '');
}

export function chooseColorById(id: string) {
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