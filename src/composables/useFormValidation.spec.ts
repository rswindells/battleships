import { describe, it, expect } from 'vitest';
import { useFormValidation } from './useFormValidation';

describe('useFormValidation', () => {
  it('validates correctly with valid input', () => {
    const validationMap = new Map([
      [(value: string) => /^[A-J](10|[1-9])$/.test(value), 'Invalid format'],
    ]);
    const { value, validate } = useFormValidation<string>(validationMap);
    value.value = 'A1';
    expect(validate()).toBe(true);
  });

  it('shows an error for invalid input', () => {
    const validationMap = new Map([
      [(value: string) => /^[A-J](10|[1-9])$/.test(value), 'Invalid format'],
    ]);
    const { value, errorMessage, validate } = useFormValidation<string>(validationMap);
    value.value = 'Z99';
    validate();
    expect(errorMessage.value).toBe('Invalid format');
  });

  it('clears the error on valid input', () => {
    const { value, errorMessage, validate, clearError } = useFormValidation<string>(new Map());
    value.value = '';
    validate();
    expect(errorMessage.value).toBe('Please enter a value');
    clearError();
    expect(errorMessage.value).toBe('');
  });

  it('shows an error for empty value', () => {
    const { value, errorMessage, validate } = useFormValidation<string>(new Map());
    value.value = '';
    expect(validate()).toBe(false);
    expect(errorMessage.value).toBe('Please enter a value');
  });

  it('validates with multiple validators and returns first error', () => {
    const validationMap = new Map([
      [(value: string) => value.length >= 3, 'Must be at least 3 characters'],
      [(value: string) => /^[A-Z]/.test(value), 'Must start with uppercase letter'],
      [(value: string) => value.endsWith('1'), 'Must end with 1'],
    ]);
    const { value, errorMessage, validate } = useFormValidation<string>(validationMap);

    value.value = 'ab';
    validate();
    expect(errorMessage.value).toBe('Must be at least 3 characters');
  });

  it('validates with multiple validators successfully', () => {
    const validationMap = new Map([
      [(value: string) => value.length >= 3, 'Must be at least 3 characters'],
      [(value: string) => /^[A-Z]/.test(value), 'Must start with uppercase letter'],
      [(value: string) => value.endsWith('1'), 'Must end with 1'],
    ]);
    const { value, errorMessage, validate } = useFormValidation<string>(validationMap);

    value.value = 'ABC1';
    expect(validate()).toBe(true);
    expect(errorMessage.value).toBe('');
  });

  it('hasError computed property works correctly', () => {
    const { value, hasError, validate } = useFormValidation<string>(new Map());

    expect(hasError.value).toBe(false);

    value.value = '';
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
    const { value, validate } = useFormValidation<number>(validationMap);

    value.value = 50;
    expect(validate()).toBe(true);

    value.value = -5;
    expect(validate()).toBe(false);
  });
});
