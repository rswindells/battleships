import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { nextTick } from 'vue';
import BattleForm from './BattleForm.vue';
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';
import BaseAlert from './BaseAlert.vue';

describe('BattleForm', () => {
  beforeEach(() => {
    // Suppress console output
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders form elements correctly', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        game: { finished: false, status: 'in_progress' },
      },
    });

    const wrapper = mount(BattleForm, {
      global: { plugins: [pinia] },
    });

    // Check title
    expect(wrapper.text()).toContain('Choose Your Target');

    // Check that BaseAlert is rendered
    expect(wrapper.findComponent(BaseAlert).exists()).toBe(true);

    // Check that BaseInput is rendered
    const input = wrapper.findComponent(BaseInput);
    expect(input.exists()).toBe(true);
    expect(input.props('placeholder')).toBe('e.g. A1');
    expect(input.props('maxlength')).toBe(3);

    // Check that submit button is rendered
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
    expect(button.attributes('type')).toBe('submit');
    expect(button.text()).toBe('Submit');
  });

  it('submits valid coordinate and calls store.attackByCoordinate', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        game: { finished: false, status: 'in_progress' },
      },
      stubActions: false,
    });

    const wrapper = mount(BattleForm, {
      global: { plugins: [pinia] },
    });

    // Get the input and set a valid value
    const input = wrapper.findComponent(BaseInput);
    await input.setValue('A1');
    await nextTick();

    // Submit the form
    await wrapper.find('form').trigger('submit.prevent');

    // Check that store action was called
    const { useGameStore } = await import('@/stores/game');
    const store = useGameStore();
    expect(store.attackByCoordinate).toHaveBeenCalledWith('A1');
  });

  it('shows validation error for empty input', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        game: { finished: false, status: 'in_progress' },
      },
    });

    const wrapper = mount(BattleForm, {
      global: { plugins: [pinia] },
    });

    // Submit form without entering anything
    await wrapper.find('form').trigger('submit.prevent');
    await nextTick();

    // Should show error message
    expect(wrapper.text()).toContain('Please enter coordinates');

    // Store should not be called
    const { useGameStore } = await import('@/stores/game');
    const store = useGameStore();
    expect(store.attackByCoordinate).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid coordinate format', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        game: { finished: false, status: 'in_progress' },
      },
    });

    const wrapper = mount(BattleForm, {
      global: { plugins: [pinia] },
    });

    // Enter invalid coordinate
    const input = wrapper.findComponent(BaseInput);
    await input.setValue('Z99');
    await nextTick();

    // Submit the form
    await wrapper.find('form').trigger('submit.prevent');
    await nextTick();

    // Should show validation error
    expect(wrapper.text()).toContain('Invalid coordinates. Must be of the format "A1".');

    // Store should not be called
    const { useGameStore } = await import('@/stores/game');
    const store = useGameStore();
    expect(store.attackByCoordinate).not.toHaveBeenCalled();
  });

  it('displays store error when attacking already attacked position', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        game: { finished: false, status: 'in_progress' },
      },
      stubActions: false,
    });

    const wrapper = mount(BattleForm, {
      global: { plugins: [pinia] },
    });

    // Mock store to throw error
    const { useGameStore } = await import('@/stores/game');
    const store = useGameStore();
    store.attackByCoordinate = vi.fn().mockImplementation(() => {
      throw new Error('Position already attacked');
    });

    // Enter valid coordinate
    const input = wrapper.findComponent(BaseInput);
    await input.setValue('A1');
    await nextTick();

    // Submit the form
    await wrapper.find('form').trigger('submit.prevent');
    await nextTick();

    // Should display store error
    expect(wrapper.text()).toContain('Position already attacked');
  });

  it('clears error when input changes', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        game: { finished: false, status: 'in_progress' },
      },
    });

    const wrapper = mount(BattleForm, {
      global: { plugins: [pinia] },
    });

    // Submit empty form to generate error
    await wrapper.find('form').trigger('submit.prevent');
    await nextTick();

    // Should show error
    expect(wrapper.text()).toContain('Please enter coordinates');

    // Type in input
    const input = wrapper.findComponent(BaseInput);
    await input.setValue('A');
    await input.trigger('input');
    await nextTick();

    // Error should be cleared
    expect(wrapper.text()).not.toContain('Please enter coordinates');
  });

  it('disables form when game is finished', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        game: { finished: true, status: 'game_over' },
      },
    });

    const wrapper = mount(BattleForm, {
      global: { plugins: [pinia] },
    });

    // Input should be disabled
    const input = wrapper.findComponent(BaseInput);
    expect(input.props('disabled')).toBe(true);

    // Button should be disabled
    const button = wrapper.findComponent(BaseButton);
    expect(button.props('disabled')).toBe(true);
  });

  it('disables submit button when input is empty', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        game: { finished: false, status: 'in_progress' },
      },
    });

    const wrapper = mount(BattleForm, {
      global: { plugins: [pinia] },
    });

    // Button should be disabled when empty
    const button = wrapper.findComponent(BaseButton);
    expect(button.props('disabled')).toBe(true);

    // Enter text
    const input = wrapper.findComponent(BaseInput);
    await input.setValue('A1');
    await nextTick();

    // Button should be enabled
    expect(button.props('disabled')).toBe(false);
  });

  it('clears form when game ends', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        game: { finished: false, status: 'in_progress' },
      },
    });

    const wrapper = mount(BattleForm, {
      global: { plugins: [pinia] },
    });

    // Enter some text
    const input = wrapper.findComponent(BaseInput);
    await input.setValue('A1');
    await nextTick();

    // Change game status to game_over
    const { useGameStore } = await import('@/stores/game');
    const store = useGameStore();
    store.status = 'game_over';
    await nextTick();

    // Form should be cleared
    expect(input.props('modelValue')).toBe('');
  });
});
