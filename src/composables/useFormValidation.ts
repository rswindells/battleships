import { ref, computed, readonly } from 'vue';

export function useFormValidation<T>(validationMap: Map<(value: T) => boolean, string>) {
  const inputValue = ref<T>('' as T);
  const errorMessage = ref('');
  const hasError = computed(() => Boolean(errorMessage.value));

  const validate = () => {
    for (const [validatorFn, errorMsg] of validationMap) {
      if (!validatorFn(inputValue.value)) {
        errorMessage.value = errorMsg;
        return false;
      }
    }

    errorMessage.value = '';
    return true;
  };

  const clearError = () => (errorMessage.value = '');
  const showError = (msg: string) => (errorMessage.value = msg);

  return {
    inputValue,
    errorMessage: readonly(errorMessage),
    hasError,
    validate,
    clearError,
    showError,
  };
}
