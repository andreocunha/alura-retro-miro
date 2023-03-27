"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomsDB = exports.saveRoomsDB = void 0;
const Rooms_1 = __importDefault(require("../models/Rooms"));
const saveRoomsDB = (rooms) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Save the rooms in MongoDB
        console.log('Salvando no banco de dados...');
        const roomsDB = JSON.stringify(rooms);
        // always save the rooms in the first document
        yield Rooms_1.default.updateOne({}, { rooms: roomsDB }, { upsert: true });
        console.log('Salas salvas com sucesso no banco de dados.');
    }
    catch (error) {
        console.error('Erro ao salvar no banco de dados:', error);
        process.exit(1);
    }
});
exports.saveRoomsDB = saveRoomsDB;
const getRoomsDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the rooms from MongoDB
        console.log('Buscando no banco de dados...');
        const rooms = yield Rooms_1.default.findOne({}); // Assuming "Rooms" is the model representing the MongoDB collection
        console.log('Salas buscadas com sucesso no banco de dados.');
        return (rooms === null || rooms === void 0 ? void 0 : rooms.rooms) || null;
    }
    catch (error) {
        console.error('Erro ao buscar no banco de dados:', error);
        process.exit(1);
    }
});
exports.getRoomsDB = getRoomsDB;
