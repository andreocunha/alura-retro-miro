import { Server, Socket } from 'socket.io';
import { handleMouseMove } from '../handlers/mouse-handlers';
import { handleNode } from '../handlers/node-handlers';
import { convertObjToArray } from '../utils/functions';
import { RoomProps } from '../interfaces/room';

export function configureSockets(io: Server): void {
  let rooms: { [key: string]: RoomProps } = {};

  function getAllRooms(): any[] {
    // return an array of all room with id, title, and createdAt
    const roomArray: any[] = [];
    for (const roomId in rooms) {
      if (Object.prototype.hasOwnProperty.call(rooms, roomId)) {
        roomArray.push({
          id: roomId,
          title: rooms[roomId].title,
          createdAt: rooms[roomId].createdAt
        });
      }
    }
    return roomArray;
  }

  io.on('connection', (socket: any) => {
    console.log('new user: ', socket.id);
    
    // wait 1 second and emit all rooms id as array
    setTimeout(() => {
      const roomArray = getAllRooms();
      socket.emit('allRooms', roomArray);
    }, 1000);

    socket.on('createRoom', (roomId: string, title: string) => {
      // verify room does not exist
      if (rooms[roomId]) {
        console.log('room already exists: ', roomId);
        socket.emit('roomAlreadyExists');
        return;
      }
      rooms[roomId] = {
        title: title,
        createdAt: new Date().toLocaleDateString(),
        nodes: {}
      };
      console.log('room created: ', roomId);
      const roomArray = getAllRooms();
      io.emit('allRooms', roomArray);
    });

    socket.on('joinRoom', (roomId: string) => {
      // verify room exists
      if (!rooms[roomId]) {
        console.log('room does not exist: ', roomId);
        socket.emit('roomDoesNotExist');
        return;
      }
      
      socket.join(roomId);
      const nodeArray = convertObjToArray(rooms[roomId].nodes);
      socket.emit('loadNodes', nodeArray);
      console.log('user joined room: ', roomId);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected: ', socket.id);
      for (const roomId in rooms) {
        if (Object.prototype.hasOwnProperty.call(rooms, roomId)) {
          delete rooms[roomId].nodes[socket.id];
        }
      }
      io.emit('userDisconnect', socket.id as string);
    });

    handleMouseMove(socket);
    handleNode(socket, rooms, io);
  });
}
