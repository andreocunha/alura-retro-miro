"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDifferent = exports.getAllRooms = exports.convertObjToArray = exports.getColorById = exports.removeNaoNumeros = void 0;
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
function convertObjToArray(data) {
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
exports.convertObjToArray = convertObjToArray;
function getAllRooms(rooms) {
    // return an array of all room with id, title, and createdAt
    const roomArray = [];
    for (const roomId in rooms) {
        if (Object.prototype.hasOwnProperty.call(rooms, roomId)) {
            roomArray.push({
                id: roomId,
                title: rooms[roomId].title,
                createdAt: rooms[roomId].createdAt
            });
        }
    }
    return roomArray;
}
exports.getAllRooms = getAllRooms;
function isDifferent(rooms, prevRooms) {
    // if different, emit allRooms
    if (JSON.stringify(rooms) !== JSON.stringify(prevRooms)) {
        return true;
    }
    return false;
}
exports.isDifferent = isDifferent;
