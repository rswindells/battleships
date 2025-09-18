<script setup lang="ts">
import { onMounted } from 'vue';
import { useGameStore } from './stores/game';

import BattleGrid from '@/components/BattleGrid.vue';
import BattleForm from '@/components/BattleForm.vue';
import BaseButton from './components/BaseButton.vue';

const gameStore = useGameStore();
onMounted(() => {
  gameStore.initGame();
});
</script>

<template>
  <header class="p-4 bg-blue-800 text-white text-center">
    <h1 class="text-4xl font-bold text-center">Battleship Demo</h1>
  </header>
  <div class="flex flex-col items-center gap-4 mt-8">
    <!-- BattleGameStatus -->
    <div class="flex flex-col items-center gap-4">
      <p v-if="gameStore.status === 'in_progress'" class="text-green-600 text-lg font-medium">
        Game in progress. Take your shot!
      </p>
      <p v-else-if="gameStore.status === 'game_over'" class="text-blue-600 text-lg font-medium">
        Congratulations! You've won the game!
      </p>
      <BattleGrid class="" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg max-w-4xl w-full">
        <!-- Battleships Status -->
        <div
          class="bg-gray-50 border border-gray-100 shadow-md rounded p-4 grid grid-cols-1 gap-4 max-w-lg mx-auto"
        >
          <h2 class="text-2xl font-bold text-center mb-4 text-slate-700">Ship Status</h2>
          <div class="grid grid-cols-1 gap-2 mb-4 px-4">
            <div
              v-for="ship in gameStore.ships"
              :key="ship.id"
              class="flex items-center justify-between"
            >
              <span class="font-medium">{{ ship.type }}</span>
              <div class="flex items-center gap-10">
                <span class="text-sm text-gray-600">{{ ship?.hits }}/{{ ship.size }}</span>
                <span
                  class="text-sm px-2 py-1 rounded"
                  :class="{
                    'bg-red-100 text-red-600': ship.isDestroyed,
                    'bg-green-100 text-green-600': !ship.isDestroyed,
                  }"
                >
                  {{ ship.isDestroyed ? 'Destroyed' : 'Intact' }}
                </span>
              </div>
            </div>
          </div>
          <div class="text-center">
            <span class="text-lg font-medium text-blue-600">
              Shots Taken: {{ gameStore?.shotsFired }}
            </span>
          </div>
          <BaseButton
            v-if="gameStore.status !== 'idle'"
            @click="gameStore.resetGame()"
            variant="secondary"
          >
            Reset Game
          </BaseButton>
        </div>
        <BattleForm class="" />
      </div>
    </div>
  </div>
</template>
