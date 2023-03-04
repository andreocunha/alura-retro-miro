import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { socket } from '../../server/socket'
import { useEffect, useState } from 'react'
import { Cursor } from '../../components/Cursor'
import { chooseColorById } from '../../utils/functions'

interface Coords {
  x: number;
  y: number;
}

interface MouseCoords {
  [id: string]: Coords;
}

export default function Home() {
  const [mouseCoords, setMouseCoords] = useState<Coords>({ x: 0, y: 0 });
  const [otherMouseCoords, setOtherMouseCoords] = useState<MouseCoords>({});
  const [socketId, setSocketId] = useState<string>('')
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected')
      setSocketId(socket.id)
    })
    socket.on('disconnect', () => {
      console.log('disconnected')
    })

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

    // atualizar o tamanho da janela quando ela é redimensionada
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
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

  useEffect(() => {
    setSocketId(socket?.id)
  }, [socket])

  const MouseCoords = ({ coords }: { coords: Coords }) => {
    return (
      <div>
        x: {coords.x}, y: {coords.y}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Alura Retro Miro</title>
        <meta name="description" content="Created by André Cunha" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>MY SOCKED ID: {socketId}</h1>
        <div>
          <div>Minhas coordenadas:</div>
          <MouseCoords coords={mouseCoords} />
          <div>Coordenadas dos outros mouses:</div>
          {Object.entries(otherMouseCoords).map(([id, coords]) => (
            <Cursor
              key={id}
              color={chooseColorById(id)}
              x={(coords.x / 100) * windowSize.width}
              y={(coords.y / 100) * windowSize.height}
            />
          ))}
        </div>
      </main>
    </>
  )
}