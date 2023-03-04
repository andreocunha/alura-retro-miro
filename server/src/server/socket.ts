import { Server } from 'socket.io';
import { MouseProps } from '../interfaces/mouse';
import { handleMouseMove } from '../handlers/mouse-handlers';

export function configureSockets(io: Server): void {
  let mouseCoords: MouseProps = {};

  io.on('connection', (socket: any) => {
    console.log('new user: ', socket.id);

    socket.on('disconnect', () => {
      console.log('user disconnected: ', socket.id);

      delete mouseCoords[socket.id];

      io.emit('mouseCoords', mouseCoords);
    });

    handleMouseMove(socket, mouseCoords, io);
  });
}
