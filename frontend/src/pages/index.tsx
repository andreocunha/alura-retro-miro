import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { HeadTab } from '../components/HeadTab';
import ReactFlow, { Controls, Background, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';
import { socket } from '../services/socket';
import { CardProps, MouseCoords } from '@/types/interfaces';
import { NODE_TYPES } from '@/types/NodeTypes';
import { convertData } from '@/utils';


export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    // add reference node
    const referenceNode = {
      id: '0',
      type: 'reference',
      position: { 
        x: 0, 
        y: 0
      },
      data: {
        setZoom: setZoom
      }
    };
    
    setNodes((ns) => ns.concat(referenceNode));
  },[])

  useEffect(() => {
    socket.on('mouseCoords', (coords: MouseCoords) => {
      // remover as coordenadas do próprio mouse
      const newCoords = { ...coords };
      delete newCoords[socket.id];
      
      // converter para array e atualizar o estado
      const newCursorsData = convertData(newCoords)

      // atualizar o estado dos nós com os novos valores
      setNodes((ns) => {
        const newNodes = ns.filter((n) => n.type !== 'cursor');
        return newNodes.concat(newCursorsData);
      });
    });

    socket.on('cardCoords', (cards: CardProps) => {
      // console.log(cards);
      const newCardsData = convertData(cards);

      setNodes((ns) => {
        const newNodes = ns.filter((n) => n.type !== 'square');
        return newNodes.concat(newCardsData);
      });
    });
  },[])

  function addNewSquare() {
    const newNode = {
      id: `${Math.random()}`,
      type: 'square',
      position: { x: 0, y: 0 },
      data: {
        text: '',
      },
    };
    socket.emit('cardEvent', newNode);
  }

  return (
    <>
      <HeadTab title="Alura Retro Miro" />
      <main className={styles.main}>
        <div style={{ height: '95vh', width: '100%' }}>
          <ReactFlow
            nodeTypes={NODE_TYPES}
            nodes={nodes}
            onNodesChange={onNodesChange}
            onNodeDragStop={(e, node) => {
              socket.emit('cardEvent', node);
            }}
            onMouseMove={(e) => {
              const nodeElement = document.querySelector('.react-flow__node');
              if(!nodeElement) return;
              const nodeRect = nodeElement.getBoundingClientRect();
              const x = (e.clientX - nodeRect.left) / zoom;
              const y = (e.clientY - nodeRect.top) / zoom;
              socket.emit('mouseMove', { x, y });
            }}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <button onClick={addNewSquare}>Add Square</button>
      </main>
    </>
  )
}