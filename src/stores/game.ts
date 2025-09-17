import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Cell, Grid } from '@/types/main';
import { getAlphabetSubset } from '@/utils/main';

export const useGameStore = defineStore('game', () => {
  const NUM_COLS = 10;
  const NUM_ROWS = 10;
  const cells = ref<Grid>();
  const columnHeaders = getAlphabetSubset(NUM_ROWS);
  const status = ref<'idle' | 'in_progress' | 'game_over'>('idle');
  const finished = computed(() => status.value === 'game_over');
  const shotsFired = ref(new Set<string>());

  function initGame() {
    // Initialize game state
    cells.value = generateGridArray(NUM_ROWS, NUM_COLS);
  }

  function resetGame() {
    // Reset game state
  }

  function attack(position: string) {
    // Handle attack logic
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
    columnHeaders,
    cells,
    initGame,
    status,
    finished,
    attack,
    shotsFired,
    resetGame,
  };
});
