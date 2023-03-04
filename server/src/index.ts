import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
})

const port = process.env.PORT || 4000;

// objeto que armazena as coordenadas de todos os mouses conectados
interface Coords {
  x: number;
  y: number;
}

// {
//   id: '3',
//   type: 'cursor',
//   position: { 
//     x: 600, 
//     y: 300
//   },
//   data: {
//     color: '#fff',
//   }
// }

interface MouseProps {
  [id: string]: {
    id: string;
    type: string;
    position: Coords;
    data: {
      color: string;
    }
  }
}

let mouseCoords: MouseProps = {};

app.get('/', (req: Request, res: Response) => {
  res.status(200).send({ message: 'API do Alura Retro Miro funcionando!' });
});

io.on('connection', (socket: Socket) => {
  console.log('new user: ', socket.id);

  socket.on('disconnect', () => {
    console.log('user disconnected: ', socket.id);

    // remover as coordenadas do mouse do cliente desconectado
    delete mouseCoords[socket.id];

    // enviar a atualização para todos os clientes
    io.emit('mouseCoords', mouseCoords);
  });

  socket.on('mouseMove', async (coords: Coords) => {
    // atualizar as coordenadas do mouse do cliente
    mouseCoords[socket.id] = {
      id: socket.id,
      type: 'cursor',
      position: coords,
      data: {
        color: '#fff',
      }
    }
    // console.log('mouseCoords: ', mouseCoords);

    io.emit('mouseCoords', mouseCoords);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
