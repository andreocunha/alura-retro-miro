"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSockets = void 0;
const mouse_handlers_1 = require("../handlers/mouse-handlers");
const node_handlers_1 = require("../handlers/node-handlers");
function configureSockets(io) {
    let mouseCoords = {};
    let nodeCoordss = {};
    io.on('connection', (socket) => {
        console.log('new user: ', socket.id);
        setTimeout(() => {
            socket.emit('mouseCoords', mouseCoords);
            socket.emit('nodeCoords', nodeCoordss);
        }, 1000);
        socket.on('disconnect', () => {
            console.log('user disconnected: ', socket.id);
            delete mouseCoords[socket.id];
            io.emit('mouseCoords', mouseCoords);
        });
        (0, mouse_handlers_1.handleMouseMove)(socket, mouseCoords, io);
        (0, node_handlers_1.handleNode)(socket, nodeCoordss, io);
    });
}
exports.configureSockets = configureSockets;
