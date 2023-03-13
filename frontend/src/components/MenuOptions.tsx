import React from 'react';
import Image from 'next/image';
import styles from "@/styles/components/MenuOptions.module.css";
import { createNewNode, getFontSize, getUrlAlert } from '@/utils';

export function MenuOptions(){
  return (
    <div className={styles.container}>
        <button 
          onClick={() => createNewNode('square', { text: '', likes: 0 }, 2700)}
          className={styles.squareButton}
        >
        </button>
        <button 
          onClick={ async () => {
            const fontSize = await getFontSize();
            if(fontSize){
              createNewNode('text', { text: 'Texto padrão...', fontSize: fontSize }, 3000)
            }
          }}
          className={styles.textButton}
        >
            <Image
              src="/icons/text.svg"
              alt="Text icon"
              width={24}
              height={24}
            />
        </button>
        <button 
          onClick={() => createNewNode('divider', { width: 5, height: 150, rotation: 0 }, 500)}
          className={styles.dividerButton}
        >
          <div className={styles.divider}></div>
        </button>

        <button 
          onClick={ async () => {
            const image = await getUrlAlert();
            if(image){
              createNewNode('image', { url: image }, 2500);
            }
          }}
          className={styles.imageButton}
        >
          <Image
            src="/icons/image.png"
            alt="Image icon"
            width={24}
            height={24}
          />
        </button>
    </div>
  )
}