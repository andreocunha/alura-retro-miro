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
  [id: string]: Coords;
}

export function CursorsDisplay({ windowSize }: { windowSize: WindowSize }) {
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
      setOtherMouseCoords(newCoords);
    });

    return () => { }
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
      {Object.entries(otherMouseCoords).map(([id, coords]) => (
        <Cursor
          key={id}
          color={chooseColorById(id)}
          x={(coords.x / 100) * windowSize.width}
          y={(coords.y / 100) * windowSize.height}
        />
      ))}
    </div>
  )
}