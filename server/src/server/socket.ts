import { Server } from 'socket.io';
import { MouseProps } from '../interfaces/mouse';
import { handleMouseMove } from '../handlers/mouse-handlers';
import { NodeProps } from '../interfaces/node';
import { handleNode } from '../handlers/node-handlers';

export function configureSockets(io: Server): void {
  let mouseCoords: MouseProps = {};
  let nodeCoordss: NodeProps = {};

  io.on('connection', (socket: any) => {
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

    handleMouseMove(socket, mouseCoords, io);
    handleNode(socket, nodeCoordss, io);
  });
}
