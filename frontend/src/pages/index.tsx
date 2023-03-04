import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { CursorsDisplay } from '../../components/CursorsDisplay'
import { HeadTab } from '../../components/HeadTab';
import ReactFlow, { Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';

export default function Home() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
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

  return (
    <>
      <HeadTab title="Alura Retro Miro" />
      <main className={styles.main}>
        <div style={{ height: '100vh', width: '100%' }}>
          <ReactFlow>
            <CursorsDisplay windowSize={windowSize} />
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </main>
    </>
  )
}