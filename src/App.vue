<script setup lang="ts">
import { onMounted } from 'vue';
import { useGameStore } from './stores/game';

import BattleGrid from '@/components/BattleGrid.vue';
import BattleForm from '@/components/BattleForm.vue';

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
    <BattleGrid class="" />
    <BattleForm class="" />
  </div>
</template>

<style scoped></style>
