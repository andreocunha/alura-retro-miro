import React from "react";
import styles from "@/styles/components/Cursor.module.css";

type Props = {
  color: string;
  name?: string;
};

export function Cursor({ color="#ccc", name="Anônimo" }: Props) {
  return (
    <>
    <svg
      width="24"
      height="36"
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.cursor}
    >
      <path
        d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
        fill={color}
      />
    </svg>
    {name && <div className={styles.name} style={{ backgroundColor: color }}>{name}</div>}
    </>
  );
}
