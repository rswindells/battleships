import { describe, it, expect } from 'vitest';
import { useFormValidation } from './useFormValidation';

describe('useFormValidation', () => {
  it('validates correctly with valid input', () => {
    const validationMap = new Map([
      [(value: string) => /^[A-J](10|[1-9])$/.test(value), 'Invalid format'],
    ]);
    const { inputValue, validate } = useFormValidation<string>(validationMap);
    inputValue.value = 'A1';
    expect(validate()).toBe(true);
  });

  it('shows an error for invalid input', () => {
    const validationMap = new Map([
      [(value: string) => /^[A-J](10|[1-9])$/.test(value), 'Invalid format'],
    ]);
    const { inputValue, errorMessage, validate } = useFormValidation<string>(validationMap);
    inputValue.value = 'Z99';
    validate();
    expect(errorMessage.value).toBe('Invalid format');
  });

  it('validates with multiple validators and returns first error', () => {
    const validationMap = new Map([
      [(value: string) => value.length >= 3, 'Must be at least 3 characters'],
      [(value: string) => /^[A-Z]/.test(value), 'Must start with uppercase letter'],
      [(value: string) => value.endsWith('1'), 'Must end with 1'],
    ]);
    const { inputValue, errorMessage, validate } = useFormValidation<string>(validationMap);

    inputValue.value = 'ab';
    validate();
    expect(errorMessage.value).toBe('Must be at least 3 characters');
  });

  it('validates with multiple validators successfully', () => {
    const validationMap = new Map([
      [(value: string) => value.length >= 3, 'Must be at least 3 characters'],
      [(value: string) => /^[A-Z]/.test(value), 'Must start with uppercase letter'],
      [(value: string) => value.endsWith('1'), 'Must end with 1'],
    ]);
    const { inputValue, errorMessage, validate } = useFormValidation<string>(validationMap);

    inputValue.value = 'ABC1';
    expect(validate()).toBe(true);
    expect(errorMessage.value).toBe('');
  });

  it('hasError computed property works correctly', () => {
    const { inputValue, hasError, validate } = useFormValidation<string>(
      new Map([[(v) => v?.length > 0, 'Value is required']]),
    );

    expect(hasError.value).toBe(false);

    inputValue.value = '';
    validate();
    expect(hasError.value).toBe(true);
  });

  it('showError method sets custom error message', () => {
    const { errorMessage, showError } = useFormValidation<string>(new Map());

    showError('Custom error message');
    expect(errorMessage.value).toBe('Custom error message');
  });

  it('works with different data types', () => {
    const validationMap = new Map([
      [(value: number) => value > 0, 'Must be positive'],
      [(value: number) => value <= 100, 'Must be 100 or less'],
    ]);
    const { inputValue, validate } = useFormValidation<number>(validationMap);

    inputValue.value = 50;
    expect(validate()).toBe(true);

    inputValue.value = -5;
    expect(validate()).toBe(false);
  });
});
