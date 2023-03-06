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
  const [width, setWidth] = useState(props?.data?.data?.width || 5);
  const [height, setHeight] = useState(props?.data?.data?.height || 150);
  const [isEditing, setIsEditing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if(!props?.data?.data?.width || !props?.data?.data?.height || !props?.data?.data?.rotation) {
      return;
    }
    setWidth(props?.data?.data?.width);
    setHeight(props?.data?.data?.height);
    setRotation(props?.data?.data?.rotation);
  }, [props])

  // a function to emit the new width, height and rotation to the server
  function handleStyleChange(width: number, height: number, rotation: number) {
    // console.log('handleStyleChange', width, height, rotation);
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

  // useEffect(() => {
  //   setTimeout(() => {
  //     handleStyleChange(width, height, rotation);
  //   }, 200);
  // }, [width, height]);

  // useEffect(() => {
  //   if (!rotateControlRef.current) {
  //     return;
  //   }

  //   const selection = select(rotateControlRef.current);
  //   const dragHandler = drag().on('drag', (evt) => {
  //     const dx = evt.x - 100;
  //     const dy = evt.y - 100;
  //     const rad = Math.atan2(dx, dy);
  //     const deg = rad * (180 / Math.PI);
  //     setRotation(180 - deg);
  //   });

  //   selection.call(dragHandler as any);
  // }, []);

  return (
    <div
      style={{ 
        transform: `rotate(${rotation}deg)`,
        width: isResizing ? '100%' : `${width}px`,
        height: isResizing ? '100%' : `${height}px`,
      }}
      className={styles.divider}
      // on click outside, set isEditing to false
      onClick={(event) => {
        if (event.target === dimensionsControlRef.current) {
          setIsEditing(!isEditing);
        }
      }}
      ref={dimensionsControlRef}
    >
      <NodeResizer 
        isVisible={isEditing} 
        minWidth={5} 
        minHeight={150}
        onResizeStart={() => setIsResizing(true)} 
        onResizeEnd={(event, dimensions) => {
          setWidth(dimensions.width);
          setHeight(dimensions.height);
          setTimeout(() => {
            handleStyleChange(dimensions.width, dimensions.height, rotation);
          }, 200);
          setIsResizing(false);
        }}
      />
      <div
        ref={rotateControlRef}
        className={styles.rotateControl}
        style={{ display: isEditing ? 'block' : 'none' }}
        onClick={() => {
          const newRotation = rotation + 45;
          setRotation(newRotation);
          handleStyleChange(width, height, newRotation);
        }}
      />
    </div>
  );
}
