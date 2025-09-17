export type CellState = 'empty' | 'ship' | 'hit' | 'miss';

export interface Cell {
  position?: string;
  state?: CellState;
}

export type Grid = Cell[][];

export interface BattleShip {
  id: number;
  type: string;
  size: number;
  positions: string[];
  hits: number;
  isDestroyed: boolean;
}

export type Fleet = BattleShip[];
