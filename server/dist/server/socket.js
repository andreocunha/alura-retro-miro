"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSockets = void 0;
const rooms_1 = require("../controllers/rooms");
const mouse_handlers_1 = require("../handlers/mouse-handlers");
const node_handlers_1 = require("../handlers/node-handlers");
const room_handlers_1 = require("../handlers/room-handlers");
const functions_1 = require("../utils/functions");
function configureSockets(io) {
    let rooms = {};
    let prevRooms = {};
    // get rooms from MongoDB
    (0, rooms_1.getRoomsDB)().then((roomsDB) => {
        if (!roomsDB)
            return;
        const objectRooms = JSON.parse(roomsDB);
        rooms = objectRooms;
        prevRooms = JSON.parse(JSON.stringify(rooms));
    });
    setInterval(() => {
        console.log('Verificando mudanças...');
        if ((0, functions_1.isDifferent)(rooms, prevRooms)) {
            // copy the value of rooms to prevRooms
            prevRooms = JSON.parse(JSON.stringify(rooms));
            // save in mongoDB
            (0, rooms_1.saveRoomsDB)(rooms);
        }
    }, 60000); // verify every 60 seconds
    io.on('connection', (socket) => {
        console.log('new user: ', socket.id);
        // wait 2 seconds and emit all rooms id as array
        setTimeout(() => {
            const roomArray = (0, functions_1.getAllRooms)(rooms);
            socket.emit('allRooms', roomArray);
        }, 2000);
        socket.on('disconnect', () => {
            console.log('user disconnected: ', socket.id);
            for (const roomId in rooms) {
                if (Object.prototype.hasOwnProperty.call(rooms, roomId)) {
                    delete rooms[roomId].nodes[socket.id];
                }
            }
            io.emit('userDisconnect', socket.id);
        });
        (0, room_handlers_1.handleRoom)(socket, rooms, io);
        (0, mouse_handlers_1.handleMouseMove)(socket);
        (0, node_handlers_1.handleNode)(socket, rooms, io);
    });
}
exports.configureSockets = configureSockets;
