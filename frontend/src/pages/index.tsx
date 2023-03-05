import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { HeadTab } from '../components/HeadTab';
import ReactFlow, { Controls, Background, Node, useNodesState, NodeProps } from 'reactflow';
import 'reactflow/dist/style.css';
import { Square } from '../components/Square';
import { Cursor } from '../components/Cursor';
import { Reference } from '../components/Reference';
import { socket } from '../server/socket';

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

interface CardProps {
  [id: string]: {
    id: string;
    type: string;
    position: Coords;
    data: {
      text: string;
    }
  }
}

const NODE_TYPES = {
  square: Square,
  cursor: (props: NodeProps<any>) => {
    const { color } = props.data;
    return <Cursor color={color}/>;
  },
  // reference with setZoom function
  reference: (props: NodeProps<any>) => <Reference data={props.data} />
};

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [zoom, setZoom] = useState(1);
  const [nodeMoving, setNodeMoving] = useState<Node | null>(null);

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
      const newCursorsData = Object.entries(newCoords).map(([id, cursor]) => ({
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

      // atualizar o estado dos nós com os novos valores
      setNodes((ns) => {
        const newNodes = ns.filter((n) => n.type !== 'cursor');
        return newNodes.concat(newCursorsData);
      });
    });

    socket.on('cardCoords', (cards: CardProps) => {
      // console.log(cards);
      const newCardsData = Object.entries(cards).map(([id, card]) => ({
        id: id,
        type: card.type,
        position: {
          x: card.position.x,
          y: card.position.y,
        },
        data: {
          text: card.data.text,
        }
      }));

      // atualiza a posição do nó que está sendo movido
      let updatedNodes = newCardsData;
      if(nodeMoving) {
        const node = newCardsData.find((n) => n.id === nodeMoving.id);
        if(node) {
          updatedNodes = newCardsData.filter((n) => n.id !== nodeMoving.id);
          updatedNodes.push(node);
        }
      }

      setNodes((ns) => {
        const newNodes = ns.filter((n) => n.type !== 'square');
        return newNodes.concat(updatedNodes);
      });
    });
  },[nodeMoving, nodes])

  // useEffect(() => {
  //   console.log('zoom', zoom);
  // }, [zoom])

  useEffect(() => {
    // console.log('nodes', nodes);
    
    // envia somente as coordenadas do nó que está sendo movido
    if(nodeMoving) {
      const node = nodes.find((n) => n.id === nodeMoving.id);
      if(node) {
        socket.emit('cardEvent', node);
      }
    }
    
  }, [nodes])

  function addNewSquare() {
    const newNode = {
      id: `${Math.random()}`,
      type: 'square',
      position: { x: 0, y: 0 },
      data: {
        text: 'New Square',
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
              setNodeMoving(null);
            }}
            onNodeDragStart={(e, node) => {
              setNodeMoving(node);
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