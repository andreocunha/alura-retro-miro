import { Socket } from "socket.io";
import { RoomProps } from "../interfaces/room";
import { convertObjToArray, getAllRooms } from "../utils/functions";

export function handleRoom(socket: Socket, rooms: { [key: string]: RoomProps }, io: any) {
  socket.on('createRoom', (roomId: string, title: string, password: string) => {
    // verify room does not exist
    if (rooms[roomId]) {
      console.log('room already exists: ', roomId);
      socket.emit('roomAlreadyExists');
      return;
    }
    rooms[roomId] = {
      title: title,
      password: password,
      createdAt: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      nodes: {}
    };
    console.log('room created: ', roomId);
    const roomArray = getAllRooms(rooms);
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

  socket.on('deleteRoom', (roomId: string, password: string) => {
    // verify room exists
    if (!rooms[roomId]) {
      console.log('room does not exist: ', roomId);
      socket.emit('roomDoesNotExist');
      return;
    }

    // verify password
    if (rooms[roomId].password !== password) {
      console.log('incorrect password: ', roomId);
      socket.emit('incorrectPassword');
      return;
    }

    delete rooms[roomId];
    console.log('room deleted: ', roomId);
    const roomArray = getAllRooms(rooms);
    io.emit('allRooms', roomArray);
  })
}