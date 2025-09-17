<script setup lang="ts">
import { useGameStore } from './stores/game';
import BattleGrid from '@/components/BattleGrid.vue';
import { onMounted } from 'vue';
const gameStore = useGameStore();
onMounted(() => {
  gameStore.initGame();
});
</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <div>
    <BattleGrid class="" />
  </div>
</template>

<style scoped></style>
