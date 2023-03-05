import React, { useState, useRef, useEffect } from "react";
import { NodeProps } from "reactflow";
import styles from "../styles/components/Square.module.css";

export function Square({ data }: NodeProps) {
  const [text, setText] = useState(data.text);
  const [squareHeight, setSquareHeight] = useState(100);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleTextareaInput() {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setSquareHeight(textarea.scrollHeight);
  }

  function handleTextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value);
  }

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      setSquareHeight(textarea.scrollHeight);
    }
  }, []);

  return (
    <div className={styles.square} style={{ height: `${squareHeight}px`, minHeight: 150 }}>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={text}
        onChange={handleTextChange}
        onInput={handleTextareaInput}
      />
    </div>
  );
}
