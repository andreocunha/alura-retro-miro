"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMouseMove = void 0;
const functions_1 = require("../utils/functions");
function handleMouseMove(socket, mouseCoords, io) {
    socket.on('mouseMove', (coords) => __awaiter(this, void 0, void 0, function* () {
        mouseCoords[socket.id] = {
            id: socket.id,
            type: 'cursor',
            position: coords,
            data: {
                color: (0, functions_1.getColorById)(socket.id),
            }
        };
        // console.log('mouseCoords: ', mouseCoords);
        socket.broadcast.emit('mouseCoords', mouseCoords);
    }));
}
exports.handleMouseMove = handleMouseMove;
