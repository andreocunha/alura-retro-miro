"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRoom = void 0;
const functions_1 = require("../utils/functions");
function handleRoom(socket, rooms, io) {
    socket.on('createRoom', (roomId, title, password) => {
        // verify room does not exist
        if (rooms[roomId]) {
            console.log('room already exists: ', roomId);
            socket.emit('roomAlreadyExists');
            return;
        }
        rooms[roomId] = {
            title: title,
            password: password,
            createdAt: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            nodes: {}
        };
        console.log('room created: ', roomId);
        const roomArray = (0, functions_1.getAllRooms)(rooms);
        io.emit('allRooms', roomArray);
    });
    socket.on('joinRoom', (roomId) => {
        // verify room exists
        if (!rooms[roomId]) {
            console.log('room does not exist: ', roomId);
            socket.emit('roomDoesNotExist');
            return;
        }
        socket.join(roomId);
        const nodeArray = (0, functions_1.convertObjToArray)(rooms[roomId].nodes);
        socket.emit('loadNodes', nodeArray);
        console.log('user joined room: ', roomId);
    });
    socket.on('deleteRoom', (roomId, password) => {
        // verify room exists
        if (!rooms[roomId]) {
            console.log('room does not exist: ', roomId);
            socket.emit('roomDoesNotExist');
            return;
        }
        // verify password
        if (rooms[roomId].password !== password) {
            console.log('incorrect password: ', roomId);
            socket.emit('incorrectPassword');
            return;
        }
        delete rooms[roomId];
        console.log('room deleted: ', roomId);
        const roomArray = (0, functions_1.getAllRooms)(rooms);
        io.emit('allRooms', roomArray);
    });
}
exports.handleRoom = handleRoom;
