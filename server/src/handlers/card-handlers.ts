import { CardProps } from '../interfaces/card';
import { Socket } from 'socket.io';

export function handleCard(socket: Socket, cardCoords: CardProps, io: any) {
  // listen for card
  socket.on('cardEvent', async (card: any) => {
    cardCoords[card.id] = {
      id: card.id,
      type: 'square',
      position: {
        x: card.position.x,
        y: card.position.y,
      },
      data: {
        text: card.data.text,
      }
    }
    // console.log('cardCoords: ', cardCoords);

    io.emit('cardCoords', cardCoords);
  });

  socket.on('cardMove', async (card: any) => {
    cardCoords[card.id] = {
      id: card.id,
      type: 'square',
      position: {
        x: card.position.x,
        y: card.position.y,
      },
      data: {
        text: card.data.text,
      }
    }
    console.log('cardCoords: ', cardCoords);

    socket.broadcast.emit('cardCoords', cardCoords);
  });
}
