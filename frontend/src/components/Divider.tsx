import { socket } from '@/services/socket';
import React, { useEffect } from 'react';
import styles from "../styles/components/Divider.module.css";
import { CustomizeNode } from './CustomizeNode';
import { ResizeRotateNode } from './ResizeRotateNode';

export function Divider({ data } : any) {
  const [color, setColor] = React.useState(data.data.color || "#ccc");
  const [isEditing, setIsEditing] = React.useState(false);

  function sendChange() {
    socket.emit('nodeMove', {
      id: data.id,
      data: {
        color: color,
        width: data.data.width,
        height: data.data.height
      }
    });
  }

  useEffect(() => {
    setColor(data.data.color);
  }, [data]);

  useEffect(() => {
    sendChange();
  }, [color]);

  return (
    <ResizeRotateNode data={data}>
      <div className={styles.divider}
        onDoubleClick={(e) => setIsEditing(!isEditing)}
        style={{ backgroundColor: color, filter: 'brightness(0.8)' }}
      />
      {
        isEditing && (
          <CustomizeNode
            color={color}
            setColor={setColor}
          />
        )
      }
    </ResizeRotateNode>
  );
}
