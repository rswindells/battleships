<script setup lang="ts">
import { onMounted } from 'vue';
import { useGameStore } from './stores/game';

import BattleGrid from '@/components/BattleGrid.vue';
import BattleForm from '@/components/BattleForm.vue';
import BattleshipGameState from '@/components/BattleshipGameState.vue';

const gameStore = useGameStore();
onMounted(() => {
  gameStore.initGame();
});
</script>

<template>
  <header class="p-4 bg-blue-800 text-white text-center">
    <h1 class="text-4xl font-bold text-center">Battleship Demo</h1>
  </header>
  <div class="mt-8">
    <div class="flex flex-col items-center gap-4">
      <p v-if="gameStore.status === 'in_progress'" class="text-green-600 text-lg font-medium">
        Game in progress. Take your shot!
      </p>
      <p v-else-if="gameStore.status === 'game_over'" class="text-blue-600 text-lg font-medium">
        🎉 Congratulations! You've won the game! 🎉
      </p>
      <BattleGrid />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg max-w-4xl w-full">
        <BattleshipGameState />
        <BattleForm />
      </div>
    </div>
  </div>
</template>
