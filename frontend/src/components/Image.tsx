import React from 'react';
import styles from "../styles/components/Image.module.css";

export function ImageComponent(props: any) {

  return (
    <div
      className={styles.image}
      >
      <img
        src={props.data.data.url}
        alt="Image"
        width={300}
      />  
      </div>
  );
}
