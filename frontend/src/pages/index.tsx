import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { HeadTab } from '../../components/HeadTab';
import ReactFlow, { Controls, Background, Node, useNodesState, NodeProps } from 'reactflow';
import 'reactflow/dist/style.css';
import { Square } from '../../components/Square';
import { Cursor } from '../../components/Cursor';
import { socket } from '../../server/socket';

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

const NODE_TYPES = {
  square: Square,
  cursor: (props: NodeProps<any>) => {
    const { color, x, y } = props.data;
    return <Cursor color={color} x={x} y={y} />;
  },
};

const SQUARE_NODE = [
  {
    id: '1',
    type: 'square',
    position: { 
      x: 200, 
      y: 400
    },
    data: {}
  },
  {
    id: '2',
    type: 'square',
    position: { 
      x: 800, 
      y: 400
    },
    data: {}
  }
]

const CURSOR_NODE = [
  {
    id: '3',
    type: 'cursor',
    position: { 
      x: 600, 
      y: 300
    },
    data: {
      color: '#fff',
    }
  }
]


export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState([...SQUARE_NODE, ...CURSOR_NODE]);

  useEffect(() => {
    socket.on('mouseCoords', (coords: MouseCoords) => {
      // remover as coordenadas do próprio mouse
      const newCoords = { ...coords };
      delete newCoords[socket.id];
      
      // converter para array e atualizar o estado
      const newCursors = Object.entries(newCoords).map(([id, cursor]) => ({
        id: id,
        type: 'cursor',
        position: {
          x: cursor.position.x,
          y: cursor.position.y,
        },
        data: {
          color: cursor.data.color,
        }
      }));
      // update the nodes with the new cursors data
      setNodes((ns) => ns.concat(newCursors));

    });
  },[])

  // useEffect(() => {
  //   console.log('nodes', nodes);
  // }, [nodes])

  function addNewSquare() {
    const newNode = {
      id: `${Math.random()}`,
      type: 'square',
      position: { x: 0, y: 0 },
      data: {},
    };
    setNodes((ns) => ns.concat(newNode));
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
            onMouseMove={(e) => {
              console.log(e);
              socket.emit('mouseMove', {
                x: e.clientX,
                y: e.clientY,
              });
            }}
          >
            {/* <CursorsDisplay 
              windowSize={windowSize} 
              setCursors={setCursors}
            /> */}
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <button onClick={addNewSquare}>Add Square</button>
      </main>
    </>
  )
}