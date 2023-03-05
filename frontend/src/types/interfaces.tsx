export interface Coords {
  x: number;
  y: number;
}

export interface MouseCoords {
  [id: string]: {
    id: string;
    type: string;
    position: Coords;
    data: {
      color: string;
    }
  }
}

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

export interface GenericNode {
  [id: string]: {
    id: string;
    type: string;
    position: Coords;
    data: any
  }
}

