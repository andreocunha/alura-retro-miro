"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorById = exports.removeNaoNumeros = void 0;
const colors_1 = require("./colors");
function removeNaoNumeros(str) {
    return str.replace(/\D/g, '');
}
exports.removeNaoNumeros = removeNaoNumeros;
function getColorById(id) {
    // converte o ID em um número inteiro
    const num = parseInt(removeNaoNumeros(id));
    // calcula o índice da cor usando o resto da divisão do número pelo número de cores
    let index = num % colors_1.COLORS.length;
    if (isNaN(index)) {
        index = 0;
    }
    // retorna a cor correspondente ao índice
    return colors_1.COLORS[index];
}
exports.getColorById = getColorById;
