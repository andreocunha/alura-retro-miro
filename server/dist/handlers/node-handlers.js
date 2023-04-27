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
exports.handleNode = void 0;
const functions_1 = require("../utils/functions");
function handleNode(socket, rooms, io) {
    // listen for node
    socket.on('nodeEvent', (node) => __awaiter(this, void 0, void 0, function* () {
        try {
            // console.log('nodeEvent: ', node);
            const roomId = Array.from(socket.rooms)[1];
            let nodeFromRoom = rooms[roomId].nodes[node.id];
            // if node already exists, update only the properties changed
            if (nodeFromRoom) {
                rooms[roomId].nodes[node.id] = Object.assign(Object.assign({}, nodeFromRoom), node);
            }
            else {
                rooms[roomId].nodes[node.id] = node;
            }
            if (rooms[roomId].nodes[node.id].type !== undefined) {
                io.to(roomId).emit('nodeCoords', rooms[roomId].nodes[node.id]);
            }
        }
        catch (err) {
            console.log('nodeEvent ERRO: ', err);
        }
    }));
    socket.on('nodeMove', (node) => __awaiter(this, void 0, void 0, function* () {
        try {
            const roomId = Array.from(socket.rooms)[1];
            let nodeFromRoom = rooms[roomId].nodes[node.id];
            // update only the properties changed
            nodeFromRoom = Object.assign(Object.assign({}, nodeFromRoom), node);
            rooms[roomId].nodes[node.id] = nodeFromRoom;
            if (rooms[roomId].nodes[node.id].type !== undefined) {
                socket.to(roomId).emit('nodeCoords', nodeFromRoom);
            }
        }
        catch (err) {
            console.log('nodeMove ERRO: ', err);
        }
    }));
    socket.on('nodeResizeEnd', (node) => __awaiter(this, void 0, void 0, function* () {
        yield (0, functions_1.delay)(100);
        try {
            const roomId = Array.from(socket.rooms)[1];
            let nodeFromRoom = rooms[roomId].nodes[node.id];
            // update only the properties changed
            nodeFromRoom = Object.assign(Object.assign({}, nodeFromRoom), node);
            rooms[roomId].nodes[node.id] = nodeFromRoom;
            if (rooms[roomId].nodes[node.id].type !== undefined) {
                io.to(roomId).emit('resizeEnd', nodeFromRoom);
            }
        }
        catch (err) {
            console.log('nodeResize ERRO: ', err);
        }
    }));
    socket.on('nodeLiked', (nodeId, increment) => __awaiter(this, void 0, void 0, function* () {
        try {
            const roomId = Array.from(socket.rooms)[1];
            const node = rooms[roomId].nodes[nodeId];
            if (increment) {
                node.data.likes++;
            }
            else if (node.data.likes > 0) {
                node.data.likes--;
            }
            io.to(roomId).emit('nodeCoords', node);
        }
        catch (err) {
            console.log('nodeLiked ERRO: ', err);
        }
    }));
    socket.on('nodeDelete', (nodeId) => __awaiter(this, void 0, void 0, function* () {
        try {
            const roomId = Array.from(socket.rooms)[1];
            delete rooms[roomId].nodes[nodeId];
            socket.to(roomId).emit('nodeDeleted', nodeId);
        }
        catch (err) {
            console.log('nodeDelete ERRO: ', err);
        }
    }));
}
exports.handleNode = handleNode;
