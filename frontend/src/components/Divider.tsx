import { socket } from '@/services/socket';
import { GenericColors } from '@/types/interfaces';
import React, { useEffect } from 'react';
import styles from "../styles/components/Divider.module.css";
import { CustomizeNode } from './CustomizeNode';
import { ResizeRotateNode } from './ResizeRotateNode';

export function Divider({ data } : any) {
  const [color, setColor] = React.useState(data.data.color || GenericColors.cinza);
  const [isEditing, setIsEditing] = React.useState(false);

  function sendChange() {
    socket.emit('nodeEvent', {
      id: data.id,
      data: {
        color: color,
        width: data.data.width,
        height: data.data.height
      }
    });
  }

  useEffect(() => {
    if(isEditing) {
      sendChange();
    }
  }, [color]);

  useEffect(() => {
    if(!isEditing) {
      setColor(data.data.color);
    }
  }, [data.data.color]);

  return (
    <ResizeRotateNode data={data}>
      <div className={styles.divider}
        onDoubleClick={(e) => setIsEditing(!isEditing)}
        style={{ 
          backgroundColor: color, 
          filter: 'brightness(0.8)'
        }}
      />
      {
        isEditing && (
          <CustomizeNode
            color={color || GenericColors.cinza}
            setColor={setColor}
          />
        )
      }
    </ResizeRotateNode>
  );
}
