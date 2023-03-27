export interface Coords {
  x: number;
  y: number;
}

export interface MouseCoords {
  id: string;
  type: string;
  position: Coords;
  data: {
    color: string;
  }
}

export interface NodeProps {
  id: string;
  type: string;
  position: Coords;
  data: any;
}

export interface GenericNode {
  [id: string]: {
    id: string;
    type: string;
    position: Coords;
    data: any
  }
}

// export enum of GenericColors
export enum GenericColors {
  azul = '#80CAFF',
  vermelho = '#ff8080',
  verde = '#80ff84',
  amarelo = '#ffec80',
  laranja = '#ffcc80',
  roxo = '#c280ff',
  rosa = '#ff80e5',
  cinza = '#cccccc',
  preto = '#000000',
  branco = '#ffffff',
}

export enum GenericZIndex {
  camada1 = '100',
  camada2 = '1200',
  camada3 = '2300',
  camada4 = '3500',
  camada5 = '4000'
}