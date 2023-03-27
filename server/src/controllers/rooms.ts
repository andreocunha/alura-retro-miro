import { RoomProps } from '../interfaces/room';
import Rooms from '../models/Rooms';


const saveRoomsDB = async (rooms: { [key: string]: RoomProps }): Promise<void> => {
  try {
    // Save the rooms in MongoDB
    console.log('Salvando no banco de dados...');
    const roomsDB = JSON.stringify(rooms);
    // always save the rooms in the first document
    await Rooms.updateOne({}, { rooms: roomsDB }, { upsert: true });
    console.log('Salas salvas com sucesso no banco de dados.');
  } catch (error) {
    console.error('Erro ao salvar no banco de dados:', error);
    process.exit(1);
  }
};

const getRoomsDB = async (): Promise<string | null> => {
  try {
    // Get the rooms from MongoDB
    console.log('Buscando no banco de dados...');
    const rooms = await Rooms.findOne({}); // Assuming "Rooms" is the model representing the MongoDB collection
    console.log('Salas buscadas com sucesso no banco de dados.');
    return rooms?.rooms || null;
  } catch (error) {
    console.error('Erro ao buscar no banco de dados:', error);
    process.exit(1);
  }
};

export { saveRoomsDB, getRoomsDB };
