import { socket } from '@/services/socket';
import { GenericZIndex } from '@/types/interfaces';
import React, { useEffect } from 'react';
import { CustomizeNode } from './CustomizeNode';
import { ResizeRotateNode } from './ResizeRotateNode';

export function ImageComponent(props: any) {
  const [zIndex, setZIndex] = React.useState(props.data.data.zIndex || GenericZIndex.camada2);
  const [isEditing, setIsEditing] = React.useState(false);

  useEffect(() => {
    if (isEditing) {
      socket.emit("nodeEvent", {
        id: props.data.id,
        zIndex: Number(zIndex),
      });
    }
  }, [zIndex]);

  return (
    <ResizeRotateNode data={props.data}>
      <img
        src={props.data.data.url}
        alt="Image"
        width="100%"
        height="100%"
        style={{
          minWidth: 10,
          zIndex: Number(zIndex),
        }}
        onDoubleClick={(e) => setIsEditing(!isEditing)}
      />  
      
      {isEditing && (
        <CustomizeNode
          zIndex={zIndex}
          setZIndex={setZIndex}
        />
      )}
    </ResizeRotateNode>
  );
}
