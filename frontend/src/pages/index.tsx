import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { HeadTab } from '../components/HeadTab';
import ReactFlow, { Controls, Background, useNodesState } from 'reactflow';
import { socket } from '../services/socket';
import { NodeProps, MouseCoords } from '@/types/interfaces';
import { NODE_TYPES } from '@/types/NodeTypes';
import { convertData, removeDuplicates } from '@/utils';

import 'reactflow/dist/style.css';
import { MenuOptions } from '@/components/MenuOptions';

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [nodeMoving, setNodeMoving] = useState<NodeProps | null>(null);
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
      
      // converter para array e remover duplicatas
      const newCursorsData = removeDuplicates(convertData(newCoords));
    
      // atualizar o estado dos nós com os novos valores
      setNodes((ns) => {
        const newNodes = ns.filter((n) => n.type !== 'cursor');
        return newNodes.concat(newCursorsData);
      });
    });
    

    socket.on('nodeCoords', (nodes: NodeProps) => {
      const newnodesData = convertData(nodes);
      
      // Remove nós duplicados
      const uniqueNodesData = removeDuplicates(newnodesData);
    
      // atualizar o estado dos nós com os novos valores
      setNodes((ns) => {
        const newNodes = ns.filter((n) => n.type !== 'text' && n.type !== 'square' && n.type !== 'divider');
        return newNodes.concat(uniqueNodesData);
      });
    });
    
  },[])

  useEffect(() => {
    console.log('nodes', nodes);
    if(nodeMoving) {
      const node = nodes.find((n) => n.id === nodeMoving.id.toString());
      socket.emit('nodeMove', node);
    }

  },[nodes])

  return (
    <>
      <HeadTab title="Alura Retro Miro" />
      <main className={styles.main}>
        <div style={{ height: '100vh', width: '100%' }}>
          <ReactFlow
            nodeTypes={NODE_TYPES}
            nodes={nodes}
            onNodesChange={onNodesChange}
            onNodeDragStart={(e, node) => {
              setNodeMoving(node as any);
            }}
            onNodeDragStop={(e, node) => {
              setNodeMoving(null);
            }}
            onMouseMove={(e) => {
              const nodeElement = document.querySelector('.react-flow__node');
              if(!nodeElement) return;
              const nodeRect = nodeElement.getBoundingClientRect();
              const x = (e.clientX - nodeRect.left) / zoom;
              const y = (e.clientY - nodeRect.top) / zoom;
              socket.emit('mouseMove', { x, y });
            }}
            onNodesDelete={(nodes) => {
              socket.emit('nodeDelete', nodes[0]);
            }}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        
        <MenuOptions />
      </main>
    </>
  )
}