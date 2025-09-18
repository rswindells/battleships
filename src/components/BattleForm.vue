<script setup lang="ts">
import { watch } from 'vue';
import { useGameStore } from '@/stores/game';
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';
import BaseAlert from './BaseAlert.vue';
import { useFormValidation } from '@/composables/useFormValidation';
import { isValidCoordinate, isNonEmptyString } from '@/utils/main';

const gameStore = useGameStore();

const { inputValue, errorMessage, hasError, validate, clearError, showError } = useFormValidation(
  new Map([
    [isNonEmptyString, 'Please enter coordinates'],
    [isValidCoordinate, 'Invalid coordinates. Must be of the format "A1".'],
  ]),
);

function selectTarget(): void {
  if (!validate()) {
    return;
  }

  try {
    const coordinate = inputValue.value;
    gameStore.attackByCoordinate(coordinate);
  } catch (error) {
    if (error instanceof Error) {
      showError(error.message);
    } else {
      showError('An unexpected error occurred.');
    }
    return;
  }
}

function clearForm(): void {
  inputValue.value = '';
  clearError();
}

watch(
  () => gameStore.status,
  (newStatus) => {
    if (newStatus === 'game_over') {
      clearForm();
    }
  },
);
</script>

<template>
  <form
    @submit.prevent="selectTarget"
    class="bg-gray-50 border border-gray-100 shadow-md rounded p-5 max-w-lg"
  >
    <h2 class="text-2xl font-bold text-center mb-4 text-slate-700">Choose Your Target</h2>

    <div class="mb-4">
      <BaseAlert
        title="Enter a coordinate by clicking the grid or typing below"
        description="It must be a letter followed by a number e.g B10"
        variant="info"
      />

      <div>
        <div class="flex justify-between gap-3 items-end">
          <label for="coordinate-input" class="relative grow block text-slate-700 text-base">
            <span class="block mb-2">Grid coordinates:</span>
            <BaseInput
              id="coordinate-input"
              v-model="inputValue"
              placeholder="e.g. A1"
              :hasError
              @input="clearError"
              :disabled="gameStore.finished"
              :maxlength="3"
            />
          </label>
          <BaseButton type="submit" variant="primary" :disabled="!inputValue || gameStore.finished">
            Submit
          </BaseButton>
        </div>
        <p v-if="errorMessage" class="w-full text-red-700 text-sm mt-2">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </form>
</template>
