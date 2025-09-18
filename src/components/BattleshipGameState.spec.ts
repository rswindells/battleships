import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import BattleshipGameState from './BattleshipGameState.vue';
import BaseButton from './BaseButton.vue';
import type { Cell } from '@/types/main';

describe('BattleshipGameState', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('displays ship status correctly with different states', async () => {
    const mockShips = [
      { id: 1, type: 'battleShip', size: 5, hits: 0, isDestroyed: false, positions: [] },
      { id: 2, type: 'destroyer', size: 4, hits: 2, isDestroyed: false, positions: [] },
      { id: 3, type: 'destroyer', size: 4, hits: 4, isDestroyed: true, positions: [] },
    ];

    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        game: {
          ships: mockShips,
          shotsFired: 10,
          status: 'in_progress',
        },
      },
    });

    const wrapper = mount(BattleshipGameState, {
      global: { plugins: [pinia] },
    });

    expect(wrapper.text()).toContain('Ship Status');

    // Ships are displayed
    expect(wrapper.text()).toContain('battleShip');
    expect(wrapper.text()).toContain('destroyer');

    // Hit counts
    expect(wrapper.text()).toContain('0/5'); // battleShip
    expect(wrapper.text()).toContain('2/4'); // damaged destroyer
    expect(wrapper.text()).toContain('4/4'); // destroyed destroyer

    // Status badges
    expect(wrapper.text()).toContain('Intact');
    expect(wrapper.text()).toContain('Destroyed');

    // Shots counter
    expect(wrapper.text()).toContain('Shots Taken: 0');
  });

  it('applies correct CSS classes for different ship states', () => {
    const mockShips = [
      { id: 1, type: 'battleShip', size: 5, hits: 0, isDestroyed: false, positions: [] },
      { id: 2, type: 'destroyer', size: 4, hits: 2, isDestroyed: false, positions: [] },
      { id: 3, type: 'cruiser', size: 3, hits: 3, isDestroyed: true, positions: [] },
    ];

    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        game: { ships: mockShips, shotsFired: 0, status: 'in_progress' },
      },
    });

    const wrapper = mount(BattleshipGameState, {
      global: { plugins: [pinia] },
    });

    const shipStatusSelector = '[data-testid="battle-ship-status"]';
    const statusElements = wrapper.findAll(shipStatusSelector);

    // 0 hits
    expect(statusElements[0].classes()).toContain('bg-green-100');
    expect(statusElements[0].classes()).toContain('text-green-600');

    // Some hits
    expect(statusElements[1].classes()).toContain('bg-amber-100');
    expect(statusElements[1].classes()).toContain('text-amber-600');

    // All hits
    expect(statusElements[2].classes()).toContain('bg-red-100');
    expect(statusElements[2].classes()).toContain('text-red-600');
  });

  it('shows reset button when game is not idle and calls resetGame on click', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        game: { ships: [], shotsFired: 5, status: 'in_progress' },
      },
      stubActions: false,
    });

    const wrapper = mount(BattleshipGameState, {
      global: { plugins: [pinia] },
    });

    const resetButton = wrapper.findComponent(BaseButton);
    expect(resetButton.exists()).toBe(true);
    expect(resetButton.text()).toBe('Reset Game');

    // Click the reset button
    await resetButton.trigger('click');

    const { useGameStore } = await import('@/stores/game');
    const store = useGameStore();
    expect(store.resetGame).toHaveBeenCalled();
  });

  it('hides reset button when game status is idle', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        game: { ships: [], shotsFired: 0, status: 'idle' },
      },
    });

    const wrapper = mount(BattleshipGameState, {
      global: { plugins: [pinia] },
    });

    const resetButton = wrapper.findComponent(BaseButton);
    expect(resetButton.exists()).toBe(false);
  });

  it('displays shots fired counter correctly', () => {
    const testCases = [
      { shotsFired: 0, expected: 'Shots Taken: 0' },
      { shotsFired: 15, expected: 'Shots Taken: 15' },
      { shotsFired: 100, expected: 'Shots Taken: 100' },
    ];

    testCases.forEach(({ shotsFired, expected }) => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          game: {
            ships: [],
            cells: createGridWithShots(shotsFired),
            status: 'in_progress',
          },
        },
      });

      const wrapper = mount(BattleshipGameState, {
        global: { plugins: [pinia] },
      });

      expect(wrapper.text()).toContain(expected);
    });
  });

  it('displays correct hit ratio format', () => {
    const mockShips = [
      { id: 1, type: 'battleShip', size: 5, hits: 3, isDestroyed: false, positions: [] },
      { id: 2, type: 'destroyer', size: 4, hits: 4, isDestroyed: true, positions: [] },
    ];

    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        game: { ships: mockShips, shotsFired: 0, status: 'in_progress' },
      },
    });

    const wrapper = mount(BattleshipGameState, {
      global: { plugins: [pinia] },
    });

    expect(wrapper.text()).toContain('3/5');
    expect(wrapper.text()).toContain('4/4');
  });
});

function createGridWithShots(totalShots: number): Cell[][] {
  return Array(10)
    .fill(null)
    .map((_, rowIndex) =>
      Array(10)
        .fill(null)
        .map((_, colIndex) => {
          const cellIndex = rowIndex * 10 + colIndex;
          return {
            position: `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`,
            state: cellIndex < totalShots ? (cellIndex % 2 === 0 ? 'hit' : 'miss') : 'empty',
          };
        }),
    );
}
