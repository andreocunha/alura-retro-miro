import styles from "@/styles/components/CustomizeNode.module.css";
import { GenericColors } from "@/types/interfaces";

interface CustomizeNodeProps {
  color: GenericColors;

  setColor: (colors: GenericColors) => void;
}

export function CustomizeNode(props: CustomizeNodeProps) {
  const colorOptions = Object.keys(GenericColors).map((key) => ({
    label: key,
    value: GenericColors[key as keyof typeof GenericColors],
  }));

  return (
    <div className={styles.container}>
      <select
        className={styles.colorSelect}
        style={{ backgroundColor: props.color }}
        value={props.color}
        onChange={(e) => {
          props.setColor(e.target.value as GenericColors);
        }}
      >
        {colorOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}