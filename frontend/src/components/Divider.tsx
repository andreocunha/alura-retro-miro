import React, { useEffect, useState, useRef } from 'react';
import { socket } from "@/services/socket";
import styles from "../styles/components/Divider.module.css";


export function Divider(props: any) {
  const dimensionsControlRef = useRef(null);
  const [rotation, setRotation] = useState(props?.data?.data?.rotation || 0);
  const [width, setWidth] = useState(props?.data?.data?.width || 5);
  const [height, setHeight] = useState(props?.data?.data?.height || 150);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // if(!props?.data?.data?.width || !props?.data?.data?.height || !props?.data?.data?.rotation) {
    //   return;
    // }
    if(!isEditing) {
      console.log('useEffect', props?.data?.data?.width, props?.data?.data?.height, props?.data?.data?.rotation);
      setWidth(props?.data?.data?.width);
      setHeight(props?.data?.data?.height);
      setRotation(props?.data?.data?.rotation);
    }
  }, [props])

  // a function to emit the new width, height and rotation to the server
  function handleStyleChange(width: number, height: number, rotation: number) {
    console.log('handleStyleChange', width, height, rotation);
    socket.emit('nodeMove', {
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

  // functions to handle input changes and update the state and send changes to server
  function handleWidthChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newWidth = Number(event.target.value);
    setWidth(newWidth);
    handleStyleChange(newWidth, height, rotation);
  }

  function handleHeightChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newHeight = Number(event.target.value);
    setHeight(newHeight);
    handleStyleChange(width, newHeight, rotation);
  }

  return (
    <div
      style={{ 
        transform: `rotate(${rotation}deg)`,
        width: `${width}px`,
        height: `${height}px`,
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
      <div
        className={styles.rotateControl}
        style={{ display: isEditing ? 'block' : 'none' }}
        onClick={() => {
          const newRotation = rotation + 45;
          setRotation(newRotation);
          handleStyleChange(width, height, newRotation);
        }}
      />
      <input 
        type="number" 
        value={width} 
        onChange={handleWidthChange} 
        style={{
          position: "absolute", 
          top: `${height/2}px`, 
          left: `${width + 10}px`, 
          display: isEditing ? 'block' : 'none', 
          width: '35px', 
          paddingLeft: '2px'
        }} 
      />
      <input 
        type="number" 
        value={height} 
        onChange={handleHeightChange} 
        style={{
          position: "absolute", 
          bottom: "-30px", 
          left: "50%", 
          display: isEditing ? 'block' : 'none', 
          appearance: "textfield",
          width: '35px', paddingLeft: '2px'
        }} 
      />

    </div>
  );
}
