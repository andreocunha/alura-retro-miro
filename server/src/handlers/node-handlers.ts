import { NodeProps } from '../interfaces/node';
import { Socket } from 'socket.io';

export function handleNode(socket: Socket, nodeCoords: NodeProps, io: any) {
  // listen for node
  socket.on('nodeEvent', async (node: any) => {
    nodeCoords[node.id] = node;
    console.log('node', node);
    io.emit('nodeCoords', node);
  });

  socket.on('nodeMove', async (node: any) => {
    nodeCoords[node.id] = node;
    socket.broadcast.emit('nodeCoords', node);
  });

  socket.on('nodeDelete', async (nodeId: string) => {
    delete nodeCoords[nodeId];
    socket.broadcast.emit('nodeDeleted', nodeId);
  });
}
