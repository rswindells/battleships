<script setup lang="ts">
import { useGameStore } from '@/stores/game';
import type { Cell } from '@/types/main';

const gameStore = useGameStore();
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
        v-for="col in gameStore.columnHeaders"
        :key="col"
        class="bg-blue-800 text-white size-10 grid place-items-center"
      >
        {{ col }}
      </div>
      <template v-for="(row, rowIndex) in gameStore.cells" :key="rowIndex">
        <div class="bg-blue-800 text-white size-10 grid place-items-center">
          {{ rowIndex + 1 }}
        </div>
        <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          class="w-10 h-10 border border-gray-400 hover:bg-blue-200 transition-colors duration-150 cursor-pointer"
          @click="() => console.log(onCellClick(cell))"
        ></div>
      </template>
    </div>
  </div>
</template>
