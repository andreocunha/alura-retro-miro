import { NodeProps } from "reactflow";

export function Square() {
  return (
    <div 
      style={{
        width: 150,
        height: 150,
        background: '#6193ff',
        borderRadius: 5,
        boxShadow: '0 1px 5px 0 rgba(255, 255, 255, 0.644)'
      }}
    />
  );
}