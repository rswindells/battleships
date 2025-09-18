<script setup lang="ts">
import { ref } from 'vue';
import { useGameStore } from '@/stores/game';

const gameStore = useGameStore();

const debug = ref(false);
function toggleDebug(): void {
  debug.value = !debug.value;
}
// @ts-expect-error fn not recognized on window
window.toggleDebug = toggleDebug;
</script>

<template>
  <div>
    <div
      class="inline-grid grid-cols-[auto_repeat(10,2.5rem)] gap-0 border border-blue-800 rounded-lg overflow-hidden select-none"
    >
      <div class="bg-blue-800"></div>
      <div
        v-for="(col, index) in gameStore.headers"
        :key="col"
        class="bg-blue-800 text-white size-10 grid place-items-center"
      >
        {{ index + 1 }}
      </div>
      <template v-for="(row, rowIndex) in gameStore.cells" :key="rowIndex">
        <div class="bg-blue-800 text-white size-10 grid place-items-center">
          {{ gameStore.headers[rowIndex] }}
        </div>
        <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          class="w-10 h-10 border border-gray-400 hover:bg-blue-200 transition-colors duration-150 cursor-pointer"
          :class="{
            'bg-green-100': (debug && cell.state === 'ship') || (debug && cell.state === 'hit'),
            'bg-red-500': cell.state === 'hit',
            'bg-gray-300': cell.state === 'miss',
            'cursor-not-allowed': cell.state === 'hit' || cell.state === 'miss',
          }"
          @click="gameStore.attackPosition(cell)"
        ></div>
      </template>
    </div>
  </div>
</template>
