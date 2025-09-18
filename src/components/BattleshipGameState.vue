<script setup lang="ts">
import { useGameStore } from '@/stores/game';
import BaseButton from './BaseButton.vue';
const gameStore = useGameStore();
</script>

<template>
  <div
    class="bg-gray-50 border border-gray-100 shadow-md rounded p-4 grid grid-cols-1 gap-4 w-full mx-auto"
  >
    <h2 class="text-2xl font-bold text-center mb-4 text-slate-700">Ship Status</h2>
    <div class="grid grid-cols-1 gap-4 mb-4 px-4">
      <div v-for="ship in gameStore.ships" :key="ship.id" class="flex justify-between items-center">
        <span class="font-medium uppercase">{{ ship.type }}</span>
        <div class="flex justify-between items-center gap-4 ml-2">
          <p class="text-sm text-gray-600">{{ ship?.hits }}/{{ ship.size }}</p>
          <span
            class="text-sm px-2 py-1 rounded w-24 text-center"
            :class="{
              'bg-red-100 text-red-600': ship.isDestroyed,
              'bg-amber-100 text-amber-600': ship.hits > 0 && !ship.isDestroyed,
              'bg-green-100 text-green-600': ship.hits === 0 && !ship.isDestroyed,
            }"
            data-testid="battle-ship-status"
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
</template>
