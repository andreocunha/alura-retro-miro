import React, { useEffect, useState } from 'react'
import { Cursor } from './Cursor'
import { chooseColorById } from '../utils/functions'
import { socket } from '../server/socket'

interface WindowSize {
  width: number;
  height: number;
}

interface Coords {
  x: number;
  y: number;
}

interface MouseCoords {
  [id: string]: {
    id: string;
    type: string;
    position: Coords;
    data: {
      color: string;
    }
  }
}
// recebe windowSize e setCursors (Dispatch<SetStateAction<[]>>) como props
export function CursorsDisplay({ windowSize, setCursors }: { windowSize: WindowSize, setCursors: any })
{
  const [mouseCoords, setMouseCoords] = useState<Coords>({ x: 0, y: 0 });
  const [otherMouseCoords, setOtherMouseCoords] = useState<MouseCoords>({});

  useEffect(() => {
    socket.on('otherMouseCoords', (coords: MouseCoords) => {
      setOtherMouseCoords(coords);
    });

    // atualizar as coordenadas dos outros mouses quando o servidor enviar uma atualização
    socket.on('mouseCoords', (coords: MouseCoords) => {
      // remover as coordenadas do próprio mouse
      const newCoords = { ...coords };
      delete newCoords[socket.id];

      // console.log(newCoords);
      
      // converter para array e atualizar o estado
      const cursors = Object.entries(newCoords).map(([id, cursor]) => ({
        id: id,
        type: 'cursor',
        position: {
          x: (cursor.position.x / 100) * window?.innerWidth,
          y: (cursor.position.y / 100) * window?.innerHeight,
        },
        data: {
          color: chooseColorById(id),
        }
      }));
      // console.log(cursors);
      setCursors(cursors);

      setOtherMouseCoords(newCoords);
    });

    return () => {}
  }, [])

  useEffect(() => {
    // escutar se o mouse se moveu
    const handleMouseMove = (event: MouseEvent) => {
      const adjustedCoords = {
        x: (event.clientX / windowSize.width) * 100,
        y: (event.clientY / windowSize.height) * 100,
      };
      setMouseCoords({ x: event.clientX, y: event.clientY });
      socket.emit('mouseMove', adjustedCoords);
    };
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    }

  }, [windowSize])

  return (
    <div>
                {/* {Object.entries(otherMouseCoords).map(([id, coords]) => (
            <Cursor
              key={id}
              color={chooseColorById(id)}
              x={(coords.x / 100) * windowSize.width}
              y={(coords.y / 100) * windowSize.height}
            />
          ))} */}
    </div>
  )
}