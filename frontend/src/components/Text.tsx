import { socket } from "@/services/socket";
import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/components/Text.module.css";

export function Text(props: any) {
  const [text, setText] = useState(props.data.data.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  function handleTextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value);
    socket.emit('nodeEvent', {
      id: props.data.id,
      type: props.data.type,
      position: {
        x: props.data.xPos,
        y: props.data.yPos
      },
      data: {
        text: event.target.value
      }
    });
  }

  useEffect(() => {
    setText(props.data.data.text);
  }, [props.data.data.text])

  return (
    <div>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={text}
        onChange={handleTextChange}
      />
    </div>
  );
}
