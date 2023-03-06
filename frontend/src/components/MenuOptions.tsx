import React from 'react';
import Image from 'next/image';
import styles from "@/styles/components/MenuOptions.module.css";
import { createNewNode } from '@/utils';

export function MenuOptions(){
  return (
    <div className={styles.container}>
        <button 
          onClick={() => createNewNode('square', { text: '' })}
          className={styles.squareButton}
        >
        </button>
        <button 
          onClick={() => createNewNode('text', { text: 'Texto padrão...' })}
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
          onClick={() => createNewNode('divider', { width: 5, height: 150, rotation: 0 })}
          className={styles.dividerButton}
        >
          <div className={styles.divider}></div>
        </button>
    </div>
  )
}