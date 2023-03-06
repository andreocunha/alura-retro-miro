import { NodeProps } from '../interfaces/node';
import { Socket } from 'socket.io';

export function handleNode(socket: Socket, nodeCoords: NodeProps, io: any) {
  // listen for node
  socket.on('nodeEvent', async (node: any) => {
    nodeCoords[node.id] = {
      id: node.id,
      type: node.type,
      position: {
        x: node.position.x,
        y: node.position.y,
      },
      data: node.data,
    }
    // console.log('nodeCoords: ', nodeCoords);

    io.emit('nodeCoords', nodeCoords);
  });

  socket.on('nodeMove', async (node: any) => {
    nodeCoords[node.id] = {
      id: node.id,
      type: node.type,
      position: {
        x: node.position.x,
        y: node.position.y,
      },
      data: node.data,
    }
    // console.log('nodeCoords: ', nodeCoords);

    socket.broadcast.emit('nodeCoords', nodeCoords);
  });
}
