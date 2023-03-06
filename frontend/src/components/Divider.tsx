import React, { useEffect, useState, useRef } from 'react';
import { NodeResizer } from '@reactflow/node-resizer';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import { socket } from "@/services/socket";
import styles from "../styles/components/Divider.module.css";
import '@reactflow/node-resizer/dist/style.css';


export function Divider(props: any) {
  const rotateControlRef = useRef(null);
  const dimensionsControlRef = useRef(null);
  const [rotation, setRotation] = useState(props?.data?.data?.rotation || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: props?.data?.data?.width || 5,
    height: props?.data?.data?.height || 150,
  });

  // a function to emit the new width, height and rotation to the server
  function handleStyleChange(width: number, height: number, rotation: number) {
    socket.emit('nodeEvent', {
      id: props.data.id,
      type: props.data.type,
      position: {
        x: props.data.xPos,
        y: props.data.yPos
      },
      data: {
        width: width,
        height: height,
        rotation: rotation
      }
    });
  }

  useEffect(() => {
    setTimeout(() => {
      handleStyleChange(dimensions.width, dimensions.height, rotation);
    }, 1000);
  }, [dimensions, rotation]);

  useEffect(() => {
    if (!rotateControlRef.current) {
      return;
    }

    const selection = select(rotateControlRef.current);
    const dragHandler = drag().on('drag', (evt) => {
      const dx = evt.x - 100;
      const dy = evt.y - 100;
      const rad = Math.atan2(dx, dy);
      const deg = rad * (180 / Math.PI);
      setRotation(180 - deg);
    });

    selection.call(dragHandler as any);
  }, []);

  return (
    <div
      style={{ 
        transform: `rotate(${rotation}deg)`,
        width: isResizing ? '100%' : `${dimensions.width}px`,
        height: isResizing ? '100%' : `${dimensions.height}px`,
      }}
      className={styles.divider}
      onClick={() => setIsEditing(!isEditing)}
      ref={dimensionsControlRef}
    >
      <NodeResizer 
        isVisible={isEditing} 
        minWidth={5} 
        minHeight={150}
        onResizeStart={() => setIsResizing(true)} 
        onResizeEnd={(event, dimensions) => {
          setDimensions({
            width: dimensions.width,
            height: dimensions.height,
          })
          setIsResizing(false);
        }}
      />
      <div
        ref={rotateControlRef}
        className={styles.rotateControl}
        style={{ display: isEditing ? 'block' : 'none' }}
      />
    </div>
  );
}
