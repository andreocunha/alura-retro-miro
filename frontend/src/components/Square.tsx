import { socket } from "@/services/socket";
import { GenericColors } from "@/types/interfaces";
import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/components/Square.module.css";
import { CustomizeNode } from "./CustomizeNode";
import { Heart } from "./Heart";

export function Square(props: any) {
  const [text, setText] = useState(props.data.data.text);
  const [color, setColor] = useState(props.data.data.color || GenericColors.azul);
  const [numLikes, setNumLikes] = useState(props.data.data.likes || 0);
  const [squareHeight, setSquareHeight] = useState(100);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [like, setLike] = useState(false);
  const dimensionsControlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(!isTyping){
      setText(props.data.data.text);
      setColor(props.data.data.color);
    }
    setNumLikes(props.data.data.likes);
  }, [props]);

  useEffect(() => {
    if(isClicked){
      sendChange();
    }
  }, [color]);

  function handleTextareaInput() {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setSquareHeight(textarea.scrollHeight);
  }

  function sendChange() {
    socket.emit("nodeEvent", {
      id: props.data.id,
      data: {
        text: text,
        likes: numLikes,
        color: color,
      },
    });
  }

  function handleTextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value);
    setIsTyping(true);
    if(typingTimeoutRef.current !== null) {
      clearInterval(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 500);

        
    socket.emit('nodeEvent', {
      id: props.data.id,
      data: {
        text: event.target.value,
        likes: numLikes,
        color: color,
      },
    });
  }

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      setSquareHeight(textarea.scrollHeight);
    }
  }, [text])

  useEffect(() => {
    // if press esc key, set isEditing to false
    const handleKeyDown = (event: { keyCode: number; }) => {
      if (event.keyCode === 27) {
        setIsClicked(false);
      }
    };

    return () => {
      document.addEventListener('keydown', handleKeyDown);
    };
  }, [dimensionsControlRef]);

  function sendLike(){
    socket.emit('nodeLiked', props.data.id, !like);
    setLike(!like);
  }

  return (
    <div 
      className={styles.square} 
      style={{ 
        height: `${squareHeight + 10}px`, 
        minHeight: 150,
        border: isClicked ? '2px solid #2689fc' : 'none',
        backgroundColor: color,
      }} 
      onDoubleClick={() => setIsClicked(!isClicked)}
      ref={dimensionsControlRef}>
        {isClicked && <CustomizeNode 
          color={color || GenericColors.azul}
          setColor={setColor}
        />}
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={text}
        onChange={handleTextChange}
        onInput={handleTextareaInput}
        placeholder="Add text"
      />
      <div className={styles.like} onClick={() => sendLike()}>
        <Heart color={like ? '#ff0000' : 'gray'} />
        ({numLikes})
      </div>
    </div>
  );
}
