import { Coords } from "./common";

export interface CardProps {
  [id: string]: {
    id: string;
    type: string;
    position: Coords;
    data: {
      text: string;
    }
  }
}
