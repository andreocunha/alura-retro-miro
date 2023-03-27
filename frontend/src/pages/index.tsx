import { CardBoard } from '@/components/CardBoard';
import { socket } from '@/services/socket';
import styles from '@/styles/Home.module.css'
import { getPasswordAlert, getTextAlert } from '@/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react'
import { HeadTab } from '../components/HeadTab';

export default function Home() {
  const [rooms, setRooms] = useState<{ id: string, title: string, createdAt: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    socket.on('allRooms', (rooms) => {
      setRooms(rooms);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className={styles.container}>
      <HeadTab title="Home" />
      
      <header className={styles.header}>
        <a 
          href="https://alura.com.br" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.logoArea} 
        >
          <Image src="/alura-logo.svg" alt="Logo Alura" width={100} height={40} />
        </a>

        <button 
          className={styles.button}
          onClick={async () => {
            const {title, password} = await getTextAlert();
            if(title && password) socket.emit('createRoom', `${Date.now()}`, title, password);
          }}
        >Novo board
        </button>
      </header>

      <main className={styles.main}>
        {isLoading ? (
          [0, 1, 2, 3].map((i) => (
            <CardBoard key={i} />
          ))
        ) : (
          rooms.map((room, index) => (
            <CardBoard 
              key={index} 
              onClick={() => window.location.href = `/room/${room.id}`}
              onDelete={async () => {
                const password = await getPasswordAlert();
                if(password) socket.emit('deleteRoom', room.id, password);
              }}
              title={room.title}
              createdAt={room.createdAt}
            />
          ))
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/andreocunha/alura-retro-miro"
          target="_blank"
          rel="noopener noreferrer"
        >
          Feito por André Cunha
        </a>
      </footer>
    </div>
  );
}