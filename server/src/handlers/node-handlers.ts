import { Socket } from 'socket.io';
import { RoomProps } from '../interfaces/room';

export function handleNode(socket: Socket, rooms: { [key: string]: RoomProps }, io: any) {
  // listen for node
  socket.on('nodeEvent', async (node: any) => {
    const roomId = Array.from(socket.rooms)[1];
    rooms[roomId].nodes[node.id] = node;
    // console.log('node', node);
    io.to(roomId).emit('nodeCoords', node);
  });

  socket.on('nodeMove', async (node: any) => {
    const roomId = Array.from(socket.rooms)[1];
    rooms[roomId].nodes[node.id] = node;
    socket.to(roomId).emit('nodeCoords', node);
  });

  socket.on('nodeDelete', async (nodeId: string) => {
    const roomId = Array.from(socket.rooms)[1];
    delete rooms[roomId].nodes[nodeId];
    socket.to(roomId).emit('nodeDeleted', nodeId);
  });
}
