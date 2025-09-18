import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useGameStore } from './game';
import type { Cell, BattleShip } from '@/types/main';
import { nextTick } from 'vue';

describe('useGameStore', () => {
  let store: ReturnType<typeof useGameStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useGameStore();
  });

  describe('initGame', () => {
    it('initializes game correctly', () => {
      store.initGame();

      expect(store.cells).toBeDefined();
      expect(store.cells).toHaveLength(10); // 10 rows
      expect(store.cells[0]).toHaveLength(10); // 10 columns
      expect(store.status).toBe('in_progress');
      expect(store.ships.length).toBeGreaterThan(0);
      expect(store.shotsFired).toBe(0);
    });

    it('creates grid with correct structure', () => {
      store.initGame();

      const grid = store.cells;
      const firstCell = grid[0][0];

      expect(firstCell).toHaveProperty('position');
      expect(firstCell).toHaveProperty('state');
      expect(firstCell.state).toBe('empty');
      expect(firstCell.position).toBe('A1');
    });

    it('places ships on the grid', () => {
      store.initGame();

      const shipPositions = store.ships.flatMap((ship) => ship.positions);
      expect(shipPositions.length).toBeGreaterThan(0);

      // Check that ship positions are marked on the grid
      const grid = store.cells;
      let shipCellsFound = 0;

      grid.forEach((row) => {
        row.forEach((cell) => {
          if (shipPositions.includes(cell.position!)) {
            expect(cell.state).toBe('ship');
            shipCellsFound++;
          }
        });
      });

      expect(shipCellsFound).toBe(shipPositions.length);
    });
  });

  describe('attack', () => {
    beforeEach(() => {
      store.initGame();
    });

    it('handles attack on empty cell (miss)', () => {
      // Find an empty cell
      const grid = store.cells;
      let emptyCell: Cell | null = null;

      for (const row of grid) {
        for (const cell of row) {
          if (cell.state === 'empty') {
            emptyCell = cell;
            break;
          }
        }
        if (emptyCell) break;
      }

      expect(emptyCell).not.toBeNull();

      store.attackPosition(emptyCell!);

      expect(emptyCell!.state).toBe('miss');
    });

    it('handles attack on ship cell (hit)', () => {
      // Find a ship cell
      const shipPosition = store.ships[0].positions[0];
      const grid = store.cells;
      let shipCell: Cell | null = null;

      for (const row of grid) {
        for (const cell of row) {
          if (cell.position === shipPosition) {
            shipCell = cell;
            break;
          }
        }
        if (shipCell) break;
      }

      expect(shipCell).not.toBeNull();
      expect(shipCell!.state).toBe('ship');

      const ship = store.ships.find((s) => s.positions.includes(shipPosition))!;
      const initialHits = ship.hits;

      store.attackPosition(shipCell!);

      expect(shipCell!.state).toBe('hit');
      expect(ship.hits).toBe(initialHits + 1);
    });

    it('does not allow attacks when game is not in progress', () => {
      store.status = 'idle';
      const testCell = store.cells[0][0];
      const initialState = testCell.state;

      store.attackPosition(testCell);

      expect(testCell.state).toBe(initialState);
    });

    it('marks ship as destroyed when all positions are hit', () => {
      const ship = store.ships[0];

      // Attack all positions of the ship
      ship.positions.forEach((position) => {
        const cell = store.cells.flat().find((c) => c.position === position)!;
        store.attackPosition(cell);
      });

      expect(ship.isDestroyed).toBe(true);
      expect(ship.hits).toBe(ship.size);
    });

    it('ends game when all ships are destroyed', async () => {
      // Attack all cells
      store.cells.flat().forEach((cell) => {
        store.attackPosition(cell);
      });

      expect(store.ships.every((ship) => ship.isDestroyed)).toBe(true);

      await nextTick(() => {
        expect(store.status).toBe('game_over');
      });
    });

    it('handles attackByCoordinate correctly', () => {
      const testPosition = 'A1';
      const testCell = store.cells.flat().find((c) => c.position === testPosition)!;
      const initialState = testCell.state;

      store.attackByCoordinate(testPosition);

      if (initialState === 'empty') {
        expect(testCell.state).toBe('miss');
      } else if (initialState === 'ship') {
        expect(testCell.state).toBe('hit');
      }
    });

    it('throws error for attacking same position twice', () => {
      const testPosition = 'A1';

      store.attackByCoordinate(testPosition);

      expect(() => {
        store.attackByCoordinate(testPosition);
      }).toThrow('Position already attacked');
    });

    it('throws error for invalid coordinates', () => {
      expect(() => {
        store.attackByCoordinate('Z99');
      }).toThrow('Invalid coordinate');
    });
  });

  describe('resetGame', () => {
    it('resets all game state', () => {
      store.initGame();
      store.attackByCoordinate('A1');

      store.resetGame();

      const shipHits = store.ships.some((ship) => ship.hits === 0);
      const cellStatesReset = store.cells
        .flat()
        .every((cell) => cell.state === 'empty' || cell.state === 'ship');
      expect(shipHits).toBe(true);
      expect(cellStatesReset).toBe(true);
      expect(store.shotsFired).toBe(0);
      expect(store.status).toBe('in_progress');
    });
  });

  describe('ship placement logic', () => {
    it('creates ships with correct sizes', () => {
      store.initGame();

      const ships = store.ships;
      expect(ships.length).toBeGreaterThan(0);

      ships.forEach((ship: BattleShip) => {
        expect(ship.positions.length).toBe(ship.size);
        expect(ship.hits).toBe(0);
        expect(ship.isDestroyed).toBe(false);
      });
    });

    it.skip('ensures ships do not overlap', () => {});

    it('places ships within grid bounds', () => {
      store.initGame();

      const allPositions = store.ships.flatMap((ship: BattleShip) => ship.positions);
      const validPattern = /^[A-J](10|[1-9])$/;

      allPositions.forEach((position: string) => {
        expect(validPattern.test(position)).toBe(true);
      });
    });
  });

  describe('computed properties', () => {
    beforeEach(() => {
      store.initGame();
    });

    it('tracks finished state correctly', async () => {
      expect(store.finished).toBe(false);

      // Destroy all ships
      store.ships.forEach((ship: BattleShip) => {
        ship.positions.forEach((position: string) => {
          const cell = store.cells.flat().find((c) => c.position === position)!;
          store.attackPosition(cell);
        });
      });

      await nextTick(() => {
        expect(store.finished).toBe(true);
      });
    });

    it('provides correct headers', () => {
      const headers = store.headers;
      expect(headers).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);
    });
  });

  describe('helper functions', () => {
    beforeEach(() => {
      store.initGame();
    });

    it('attackPosition works with cell objects', () => {
      const grid = store.cells;
      const testCell = grid[0][0];
      const initialState = testCell.state;

      store.attackPosition(testCell);

      if (initialState === 'empty') {
        expect(testCell.state).toBe('miss');
      } else if (initialState === 'ship') {
        expect(testCell.state).toBe('hit');
      }
    });
  });

  describe('edge cases and error handling', () => {
    it('handles game state transitions correctly', async () => {
      expect(store.status).toBe('idle');

      store.initGame();
      expect(store.status).toBe('in_progress');

      // Win the game
      store.ships.forEach((ship: BattleShip) => {
        ship.positions.forEach((position: string) => {
          const cell = store.cells.flat().find((c) => c.position === position)!;
          store.attackPosition(cell);
        });
      });

      await nextTick(() => {
        expect(store.status).toBe('game_over');
      });
    });

    it('handles invalid attack positions gracefully', () => {
      store.initGame();

      expect(() => {
        store.attackByCoordinate('');
      }).toThrow('Invalid coordinate');

      expect(() => {
        store.attackByCoordinate('Z99');
      }).toThrow('Invalid coordinate');

      expect(() => {
        store.attackByCoordinate('A0');
      }).toThrow('Invalid coordinate');

      expect(() => {
        store.attackByCoordinate('K1');
      }).toThrow('Invalid coordinate');
    });
  });

  describe.skip('error handling');
});
