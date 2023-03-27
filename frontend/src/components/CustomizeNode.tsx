import styles from "@/styles/components/CustomizeNode.module.css";
import { GenericColors, GenericZIndex } from "@/types/interfaces";

interface CustomizeNodeProps {
  color?: GenericColors;
  setColor?: (colors: GenericColors) => void;
  zIndex?: GenericZIndex;
  setZIndex?: (zIndex: GenericZIndex) => void;
}

export function CustomizeNode({
  color,
  setColor,
  zIndex,
  setZIndex,
}: CustomizeNodeProps) {
  const colorOptions = Object.keys(GenericColors).map((key) => ({
    label: key,
    value: GenericColors[key as keyof typeof GenericColors],
  }));
  const zIndexOptions = Object.keys(GenericZIndex).map((key) => ({
    label: key,
    value: GenericZIndex[key as keyof typeof GenericZIndex],
  }));

  return (
    <div className={styles.container}>
      {(color && setColor) && <select
        className={styles.colorSelect}
        style={{ backgroundColor: color }}
        value={color}
        onChange={(e) => {
          setColor(e.target.value as GenericColors);
        }}
      >
        {colorOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>}

      {(zIndex && setZIndex) && <select
        className={styles.colorSelect}
        value={zIndex}
        onChange={(e) => {
          setZIndex(e.target.value as unknown as GenericZIndex);
        }}
      >
        {zIndexOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>}
    </div>
  )
}