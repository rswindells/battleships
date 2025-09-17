<script setup lang="ts">
const colHeaders: string[] = getAlphabetSubset(10);
const rowHeaders: number[] = getNumberSubset(10);

type CellState = 'empty' | 'ship' | 'hit' | 'miss';
interface Cell {
  position?: string;
  state?: CellState;
}
const cells = generateGridArray(10, 10);

function generateGridArray(rows: number, cols: number): Cell[][] {
  if (rows > 26) throw new Error('Rows must be less than 26');

  const grid: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ state: 'empty' })),
  );

  return grid.map((row, rowIndex) =>
    row.map((cell, colIndex) => ({
      ...cell,
      position: `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`,
    })),
  );
}

function getAlphabetSubset(n: number): string[] {
  if (n < 1 || n > 26) throw new Error('n must be between 1 and 26');
  return Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
}

function getNumberSubset(n: number): number[] {
  if (n < 1) throw new Error('n must be at least 1');
  return Array.from({ length: n }, (_, i) => i + 1);
}

function onCellClick(cell: Cell): string {
  return `${cell.position}`;
}
</script>

<template>
  <div>
    <div
      class="inline-grid grid-cols-[auto_repeat(10,2.5rem)] gap-0 border border-blue-800 rounded-lg overflow-hidden"
    >
      <div class="bg-blue-800"></div>
      <div
        v-for="col in colHeaders"
        :key="col"
        class="bg-blue-800 text-white size-10 grid place-items-center"
      >
        {{ col }}
      </div>
      <template v-for="(row, rowIndex) in cells" :key="rowIndex">
        <div class="bg-blue-800 text-white size-10 grid place-items-center">
          {{ rowIndex + 1 }}
        </div>
        <div
          v-for="(cell, colIndex) in cells[rowIndex]"
          :key="colIndex"
          class="w-10 h-10 border border-gray-400 hover:bg-blue-200 transition-colors duration-150 cursor-pointer"
          @click="() => console.log(onCellClick(cell))"
        ></div>
      </template>
    </div>
  </div>
</template>
