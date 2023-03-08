import { Server } from 'socket.io';
import { handleMouseMove } from '../handlers/mouse-handlers';
import { NodeProps } from '../interfaces/node';
import { handleNode } from '../handlers/node-handlers';
import { convertObjToArray } from '../utils/functions';

export function configureSockets(io: Server): void {
  let nodeCoords: NodeProps = {};

  io.on('connection', (socket: any) => {
    console.log('new user: ', socket.id);

    setTimeout(() => {
      const nodeArray = convertObjToArray(nodeCoords);
      socket.emit('loadNodes', nodeArray);
    }, 1000);

    socket.on('disconnect', () => {
      console.log('user disconnected: ', socket.id);
      io.emit('userDisconnect', socket.id as string);
    });

    handleMouseMove(socket);
    handleNode(socket, nodeCoords, io);
  });
}
