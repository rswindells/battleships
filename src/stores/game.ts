import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { BattleShip, Cell, Grid } from '@/types/main';
import { getAlphabetSubset } from '@/utils/main';

export const useGameStore = defineStore('game', () => {
  const NUM_COLS = 10;
  const NUM_ROWS = 10;
  const cells = ref<Grid>();
  const headers = getAlphabetSubset(NUM_ROWS);
  const status = ref<'idle' | 'in_progress' | 'game_over'>('idle');
  const finished = computed(() => status.value === 'game_over');
  const shotsFired = computed(
    () =>
      cells.value?.flatMap((row) =>
        row.filter((cell) => cell.state === 'hit' || cell.state === 'miss'),
      ).length || 0,
  );
  const ships = ref<BattleShip[]>([]);
  const shipPositions = computed(() => ships.value.flatMap((ship) => ship.positions));
  const shipTypes = {
    battleShip: { size: 5 },
    destroyer: { size: 4 },
  };

  function initGame() {
    cells.value = generateGridArray(NUM_ROWS, NUM_COLS);

    ships.value = [];
    status.value = 'in_progress';

    setupBattleShipPositions();
  }

  function resetGame() {
    initGame();
  }

  function attackByCoordinate(coordinate: Cell['position']) {
    const cell = cells.value?.flatMap((row) => row).find((c) => c.position === coordinate);
    if (cell) {
      console.log('Attacking position:', cell);
      if (cell.state === 'hit' || cell.state === 'miss') {
        throw new Error('Position already attacked');
      }

      attackPosition(cell);
    } else {
      throw new Error('Invalid coordinate');
    }
  }

  function attackPosition(cell: Cell) {
    // Handle attackPosition logic
    if (status.value !== 'in_progress' || !cell.position) return;

    if (cell.state === 'ship') {
      cell.state = 'hit';
      // Update ship hit status
      const hitShip = ships.value.find((ship) => ship.positions.includes(cell.position!));
      if (hitShip) {
        hitShip.hits++;
        if (hitShip.hits >= hitShip.size) {
          hitShip.isDestroyed = true;
          // Check if all ships are destroyed
          if (ships.value.every((ship) => ship.isDestroyed)) {
            status.value = 'game_over';
          }
        }
      }
    } else if (cell.state === 'empty') {
      cell.state = 'miss';
    }
  }

  function setupBattleShipPositions() {
    ships.value.push(
      createShip({
        id: 1,
        type: 'battleShip',
        size: shipTypes.battleShip.size,
        positions: [],
        hits: 0,
        isDestroyed: false,
      }),
    );
    ships.value.push(
      createShip({
        id: 2,
        type: 'destroyer',
        size: shipTypes.destroyer.size,
        positions: [],
        hits: 0,
        isDestroyed: false,
      }),
    );
    ships.value.push(
      createShip({
        id: 3,
        type: 'destroyer',
        size: shipTypes.destroyer.size,
        positions: [],
        hits: 0,
        isDestroyed: false,
      }),
    );

    cells.value?.forEach((row) => {
      row.forEach((cell) => {
        if (shipPositions.value.includes(cell.position!)) {
          cell.state = 'ship';
        }
      });
    });
  }

  function createShip(config: BattleShip) {
    const ship: BattleShip = {
      ...config,
      hits: 0,
      isDestroyed: false,
      positions: [],
    };

    try {
      const shipCoordinates = tryMaxAttempts(() => getValidShipPosition(ship.size));
      ship.positions = shipCoordinates;
    } catch (error) {
      console.error('Unable to to place ship:', error);
    }

    return ship;
  }

  function getRandomInteger(min: number, max: number) {
    const diff = max + 1 - min;
    return Math.floor(diff * Math.random() + min);
  }

  function tryMaxAttempts(fn: () => string[], maxAttempts = 20): string[] {
    let attempts = 0;
    let result: string[] = [];

    while (attempts < maxAttempts) {
      try {
        result = fn();
        return result;
      } catch (error) {
        attempts++;
        console.warn(`Attempt ${attempts} failed:`, error);
      }
    }

    throw new Error(`Failed to execute function after ${maxAttempts} attempts`);
  }

  function getValidShipPosition(size: number): string[] {
    const orientations = ['horizontal', 'vertical'] as const;
    const orientation = orientations[Math.floor(Math.random() * orientations.length)];
    const position: string[] = [];
    const startRow = getRandomInteger(0, NUM_ROWS - 1);
    const startCol = getRandomInteger(0, NUM_COLS - 1);
    const startPos = `${String.fromCharCode(65 + startRow)}${startCol + 1}`;

    if (!isWithinBounds(startPos)) throw new Error('Starting position out of bounds');
    for (let i = 0; i < size; i++) {
      let newRow = startRow;
      let newCol = startCol;

      if (orientation === 'horizontal') {
        newCol += i;
      } else {
        newRow += i;
      }

      const newPos = `${String.fromCharCode(65 + newRow)}${newCol + 1}`;
      if (!isWithinBounds(newPos)) throw new Error('Ship placement out of bounds');
      if (!isClearOfOtherShips(newPos, ships.value))
        throw new Error('Ship placement overlaps another ship');
      position.push(newPos);
    }

    return position;
  }

  function isWithinBounds(position: string): boolean {
    const row = position.charCodeAt(0) - 65; // Convert letter to index (A=0, B=1, ...)
    const col = parseInt(position.slice(1), 10) - 1; // Convert number to index (1=0, 2=1, ...)

    return row >= 0 && row < NUM_ROWS && col >= 0 && col < NUM_COLS;
  }

  function isClearOfOtherShips(position: string, fleetPositions: BattleShip[]): boolean {
    return !fleetPositions.some((ship) => ship.positions.includes(position));
  }

  function generateGridArray(rows: number, cols: number): Cell[][] {
    if (rows > 26) throw new Error('Rows must be less than 26');

    const grid: Grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ state: 'empty' })),
    );

    return grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => ({
        ...cell,
        position: `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`,
      })),
    );
  }

  return {
    headers,
    cells,
    initGame,
    status,
    finished,
    attackPosition,
    attackByCoordinate,
    shotsFired,
    resetGame,

    setupBattleShipPositions,
    createShip,
    getRandomInteger,
    tryMaxAttempts,
    getValidShipPosition,
    isWithinBounds,
    generateGridArray,
    NUM_COLS,
    NUM_ROWS,
    ships,
    shipPositions,
    shipTypes,
  };
});
