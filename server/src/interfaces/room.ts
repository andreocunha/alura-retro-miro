import { NodeProps } from "./node";

export interface RoomProps {
  title: string;
  password: string;
  createdAt: string;
  nodes: NodeProps;
}