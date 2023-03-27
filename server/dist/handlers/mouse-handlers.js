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
function handleMouseMove(socket) {
    socket.on('mouseMove', (coords, name) => __awaiter(this, void 0, void 0, function* () {
        const roomId = Array.from(socket.rooms)[1];
        const mouseInfo = {
            id: socket.id,
            type: 'cursor',
            position: coords,
            data: {
                color: (0, functions_1.getColorById)(socket.id),
                name,
            },
            zIndex: 5000,
        };
        socket.to(roomId).emit('nodeCoords', mouseInfo);
    }));
}
exports.handleMouseMove = handleMouseMove;
