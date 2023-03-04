import { Coords } from '../interfaces/common';
import { MouseProps } from '../interfaces/mouse';
import { Socket } from 'socket.io';

export function handleMouseMove(socket: Socket, mouseCoords: MouseProps, io: any) {
  socket.on('mouseMove', async (coords: Coords) => {
    mouseCoords[socket.id] = {
      id: socket.id,
      type: 'cursor',
      position: coords,
      data: {
        color: '#fff',
      }
    }
    console.log('mouseCoords: ', mouseCoords);

    io.emit('mouseCoords', mouseCoords);
  });
}
