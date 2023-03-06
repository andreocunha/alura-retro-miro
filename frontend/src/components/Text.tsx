import { socket } from "@/services/socket";
import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/components/Text.module.css";

export function Text(props: any) {
  const [text, setText] = useState(props.data.data.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout | null>(null);

  function handleKeyDown(): void {
    if (typingTimer) {
      clearTimeout(typingTimer);
    }
  }

  function handleKeyUp(): void {
    if (typingTimer) {
      clearTimeout(typingTimer);
    }
    setTypingTimer(setTimeout(() => {
      console.log('O usuário parou de digitar.');
      socket.emit('nodeEvent', {
        id: props.data.id,
        type: props.data.type,
        position: {
          x: props.data.xPos,
          y: props.data.yPos
        },
        data: {
          text: text
        }
      });
    }, 1000));
  }

  useEffect(() => {
    return () => {
      if (typingTimer) {
        clearTimeout(typingTimer);
      }
    };
  }, [typingTimer]);

  function handleTextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value);
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
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />
    </div>
  );
}
