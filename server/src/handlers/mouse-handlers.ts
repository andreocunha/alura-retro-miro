import { Coords } from '../interfaces/common';
import { Socket } from 'socket.io';
import { getColorById } from '../utils/functions';

export function handleMouseMove(socket: Socket) {
  socket.on('mouseMove', async (coords: Coords) => {
    const mouseInfo = {
      id: socket.id,
      type: 'cursor',
      position: coords,
      data: {
        color: getColorById(socket.id),
      },
      zIndex: 5000,
    }
    socket.broadcast.emit('nodeCoords', mouseInfo);
  });
}
