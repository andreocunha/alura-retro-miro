import React, { useEffect, useState, useRef } from 'react';
import { socket } from "@/services/socket";
import styles from "../styles/components/Divider.module.css";
import { NodeResizer } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';

export function Divider({ data } : any) {
  const dimensionsControlRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [initialWidth, setInitialWidth] = useState(5);
  const [initialHeight, setInitialHeight] = useState(150);

  useEffect(() => {
    if(!isEditing){
      setInitialWidth(data?.data?.width || 5);
      setInitialHeight(data?.data?.height || 150);
    }
  }, [data]);

  return (
    <div
      className={styles.divider}
      ref={dimensionsControlRef}
      onDoubleClick={(e) => setIsEditing(true)}
      onClick={(e) => setIsEditing(false)}
      // on long press
      onContextMenu={(e) => {
        e.preventDefault();
        setIsEditing(true);
      }}
      style={{
        width: isResizing ? '100%' : initialWidth,
        height: isResizing ? '100%' : initialHeight
      }}
    >
      <NodeResizer
        minHeight={5}
        minWidth={5}
        lineStyle={{ stroke: 'black', strokeWidth: 1 }}
        isVisible={isEditing}
        lineClassName={styles.line}
        handleClassName={styles.handle}
        onResize={(size) => {
          // console.log('onResize')
          setIsResizing(true);
          const { width, height } = dimensionsControlRef.current?.getBoundingClientRect() || { width: 5, height: 150 };
          setInitialHeight(height);
          setInitialWidth(width);

          socket.emit('nodeMove', {
            id: data.id,
            type: data.type,
            position: {
              x: data.xPos,
              y: data.yPos
            },
            data: {
              width: width,
              height: height,
              rotation: 0
            },
            zIndex: 500
          });
        }}
        onResizeEnd={(size) => {
          setIsResizing(false);
          const { width, height } = dimensionsControlRef.current?.getBoundingClientRect() || { width: 5, height: 150 };
          setInitialHeight(height);
          setInitialWidth(width);

          socket.emit('nodeEvent', {
            id: data.id,
            type: data.type,
            position: {
              x: data.xPos,
              y: data.yPos
            },
            data: {
              width: width,
              height: height,
              rotation: 0
            },
            zIndex: 500
          });
        }}
      />
    </div>
  );
}
