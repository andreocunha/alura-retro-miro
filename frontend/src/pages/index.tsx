import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { HeadTab } from '../components/HeadTab';
import ReactFlow, { Controls, Background, useNodesState } from 'reactflow';
import { socket } from '../services/socket';
import { NodeProps, MouseCoords } from '@/types/interfaces';
import { NODE_TYPES } from '@/types/NodeTypes';
import { convertData } from '@/utils';

import 'reactflow/dist/style.css';

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

    socket.on('nodeCoords', (nodes: NodeProps) => {
      // console.log(nodes);
      const newnodesData = convertData(nodes);

      setNodes((ns) => {
        const newNodes = ns.filter((n) => n.type !== 'square');
        return newNodes.concat(newnodesData);
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
    socket.emit('nodeEvent', newNode);
  }

  function addNewText() {
    const newNode = {
      id: `${Math.random()}`,
      type: 'text',
      position: { x: 0, y: 0 },
      data: {
        text: 'Texto padrão',
      },
    };
    socket.emit('nodeEvent', newNode);
  }

  function addNewDivider() {
    const newNode = {
      id: `${Math.random()}`,
      type: 'divider',
      position: { x: 0, y: 0 },
      data: {
        text: '',
      },
    };
    socket.emit('nodeEvent', newNode);
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
              socket.emit('nodeEvent', node);
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
        <button onClick={addNewText}>Add Text</button>
        <button onClick={addNewDivider}>Add Divider</button>
      </main>
    </>
  )
}