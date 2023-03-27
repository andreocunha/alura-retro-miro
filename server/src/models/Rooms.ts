import mongoose, { Document, Schema } from 'mongoose';

interface IRooms extends Document {
  rooms: string;
}

const RoomsSchema = new Schema(
  {
    rooms: { type: String, required: true },
  },
  { timestamps: true }
);

const Rooms = mongoose.model<IRooms>('Rooms', RoomsSchema);

export default Rooms;
