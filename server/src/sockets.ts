import { Server, Socket } from 'socket.io';

interface Coords {
  x: number;
  y: number;
}

interface MouseProps {
  [id: string]: {
    id: string;
    type: string;
    position: Coords;
    data: {
      color: string;
    }
  }
}

let mouseCoords: MouseProps = {};

export function configureSockets(io: Server): void {
  io.on('connection', (socket: Socket) => {
    console.log('new user: ', socket.id);

    socket.on('disconnect', () => {
      console.log('user disconnected: ', socket.id);

      delete mouseCoords[socket.id];

      io.emit('mouseCoords', mouseCoords);
    });

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
  });
}
