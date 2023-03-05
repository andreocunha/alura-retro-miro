import React from "react";
import styles from "../styles/components/Divider.module.css";
import { NodeResizer } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';

export function Divider() {
  return (
    <div className={styles.divider}>
      <NodeResizer isVisible={true} minWidth={5} minHeight={150} />
    </div>
  );
}
