import { Coords } from '../interfaces/common';
import { MouseProps } from '../interfaces/mouse';
import { Socket } from 'socket.io';
import { getColorById } from '../utils/functions';

export function handleMouseMove(socket: Socket, mouseCoords: MouseProps, io: any) {
  socket.on('mouseMove', async (coords: Coords) => {
    mouseCoords[socket.id] = {
      id: socket.id,
      type: 'cursor',
      position: coords,
      data: {
        color: getColorById(socket.id),
      }
    }
    // console.log('mouseCoords: ', mouseCoords);

    io.emit('mouseCoords', mouseCoords);
  });
}
