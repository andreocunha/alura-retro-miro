import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { CursorsDisplay } from '../../components/CursorsDisplay'
import { HeadTab } from '../../components/HeadTab';
import ReactFlow, { Controls, Background, Node, useNodesState, NodeProps } from 'reactflow';
import 'reactflow/dist/style.css';
import { Square } from '../../components/Square';
import { Cursor } from '../../components/Cursor';


type NodeData = {
  color?: string;
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
  },
]


export default function Home() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [nodes, setNodes, onNodesChange] = useNodesState([...SQUARE_NODE, ...CURSOR_NODE]);

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
          >
            {/* <CursorsDisplay windowSize={windowSize} /> */}
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <button onClick={addNewSquare}>Add Square</button>
      </main>
    </>
  )
}