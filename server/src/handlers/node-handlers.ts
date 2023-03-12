import { Socket } from 'socket.io';
import { RoomProps } from '../interfaces/room';

export function handleNode(socket: Socket, rooms: { [key: string]: RoomProps }, io: any) {
  // listen for node
  socket.on('nodeEvent', async (node: any) => {
    try {
      console.log('nodeEvent: ', node);
      const roomId = Array.from(socket.rooms)[1];
      rooms[roomId].nodes[node.id] = node;
      io.to(roomId).emit('nodeCoords', node);
    }
    catch (err) {
      console.log('nodeEvent ERRO: ', err);
    }
  });

  socket.on('nodeMove', async (node: any) => {
    try {
      const roomId = Array.from(socket.rooms)[1];
      rooms[roomId].nodes[node.id] = node;
      socket.to(roomId).emit('nodeCoords', node);
    }
    catch (err) {
      console.log('nodeMove ERRO: ', err);
    }
  });

  socket.on('nodeLiked', async (nodeId: string, increment: boolean) => {
    try {
      const roomId = Array.from(socket.rooms)[1];
      const node = rooms[roomId].nodes[nodeId];
      if (increment) {
        node.data.likes++;
      }
      else if (node.data.likes > 0) {
        node.data.likes--;
      }
      io.to(roomId).emit('nodeCoords', node);
    }
    catch (err) {
      console.log('nodeLiked ERRO: ', err);
    }
  });

  socket.on('nodeDelete', async (nodeId: string) => {
    try {
      const roomId = Array.from(socket.rooms)[1];
      delete rooms[roomId].nodes[nodeId];
      socket.to(roomId).emit('nodeDeleted', nodeId);
    }
    catch (err) {
      console.log('nodeDelete ERRO: ', err);
    }
  });
}
