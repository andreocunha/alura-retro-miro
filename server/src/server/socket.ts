import { Server } from 'socket.io';
import { getRoomsDB, saveRoomsDB } from '../controllers/rooms';
import { handleMouseMove } from '../handlers/mouse-handlers';
import { handleNode } from '../handlers/node-handlers';
import { handleRoom } from '../handlers/room-handlers';
import { RoomProps } from '../interfaces/room';
import { getAllRooms, isDifferent } from '../utils/functions';

export function configureSockets(io: Server): void {
  let rooms: { [key: string]: RoomProps } = {};
  let prevRooms: { [key: string]: RoomProps } = {};

  // get rooms from MongoDB
  getRoomsDB().then((roomsDB) => {
    if(!roomsDB) return;
    const objectRooms = JSON.parse(roomsDB as string);
    rooms = objectRooms;
    prevRooms = JSON.parse(JSON.stringify(rooms));
  });

  setInterval(() => {
    console.log('Verificando mudanças...');
    if (isDifferent(rooms, prevRooms)) {
      // copy the value of rooms to prevRooms
      prevRooms = JSON.parse(JSON.stringify(rooms));
      // save in mongoDB
      saveRoomsDB(rooms);
    }
  }, 60000); // verify every 60 seconds

  io.on('connection', (socket: any) => {
    console.log('new user: ', socket.id);
    
    // wait 2 seconds and emit all rooms id as array
    setTimeout(() => {
      const roomArray = getAllRooms(rooms);
      socket.emit('allRooms', roomArray);
    }, 2000);

    socket.on('disconnect', () => {
      console.log('user disconnected: ', socket.id);
      for (const roomId in rooms) {
        if (Object.prototype.hasOwnProperty.call(rooms, roomId)) {
          delete rooms[roomId].nodes[socket.id];
        }
      }
      io.emit('userDisconnect', socket.id as string);
    });

    handleRoom(socket, rooms, io);
    handleMouseMove(socket);
    handleNode(socket, rooms, io);
  });
}
