import { ref, computed, readonly } from 'vue';

export function useFormValidation<T>(validationMap: Map<(value: T) => boolean, string>) {
  const value = ref<T>('' as T);
  const errorMessage = ref('');
  const hasError = computed(() => Boolean(errorMessage.value));

  const validate = () => {
    if (!value.value) {
      errorMessage.value = 'Please enter a value';
      return false;
    }

    for (const [validatorFn, errorMsg] of validationMap) {
      if (!validatorFn(value.value)) {
        errorMessage.value = errorMsg;
        return false;
      }
    }

    errorMessage.value = '';
    return true;
  };

  const clearError = () => (errorMessage.value = '');
  const showError = (msg: string) => (errorMessage.value = msg);

  return { value, errorMessage: readonly(errorMessage), hasError, validate, clearError, showError };
}
