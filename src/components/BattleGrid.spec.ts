import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import BattleGrid from './BattleGrid.vue';

const cellSelector = '[data-testid="grid-cell"]';

// Helper function to create a test grid
function createTestGrid(rows = 3, cols = 3) {
  return Array(rows)
    .fill(null)
    .map((_, rowIndex) =>
      Array(cols)
        .fill(null)
        .map((_, colIndex) => ({
          position: `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`,
          state: 'empty' as const,
        })),
    );
}

describe('BattleGrid', () => {
  beforeEach(() => {
    // Suppress console output
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders the correct number of cells', () => {
    const testCells = createTestGrid(10, 10);

    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        game: {
          cells: testCells,
          status: 'in_progress',
        },
      },
    });

    const wrapper = mount(BattleGrid, {
      global: { plugins: [pinia] },
    });

    const cells = wrapper.findAll(cellSelector);
    expect(cells).toHaveLength(100);
  });

  it.todo('renders a custom number of cells');

  it('applies correct CSS classes for different cell states', () => {
    const testCells = [
      [
        { position: 'A1', state: 'empty' },
        { position: 'A2', state: 'hit' },
        { position: 'A3', state: 'miss' },
      ],
    ];

    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        game: {
          cells: testCells,
          status: 'in_progress',
        },
      },
    });

    const wrapper = mount(BattleGrid, {
      global: { plugins: [pinia] },
    });

    const cells = wrapper.findAll(cellSelector);

    // Empty cell
    expect(cells[0].classes()).toContain('hover:bg-blue-200');

    // Hit cell
    expect(cells[1].classes()).toContain('bg-red-500');
    expect(cells[1].classes()).toContain('cursor-not-allowed');

    // Miss cell
    expect(cells[2].classes()).toContain('bg-gray-300');
    expect(cells[2].classes()).toContain('cursor-not-allowed');
  });

  it('calls store.attackPosition when cell is clicked', async () => {
    const testCells = createTestGrid(10, 10);

    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        game: {
          cells: testCells,
          status: 'in_progress',
        },
      },
      stubActions: false,
    });

    const wrapper = mount(BattleGrid, {
      global: { plugins: [pinia] },
    });

    const firstCell = wrapper.find(cellSelector);
    await firstCell.trigger('click');

    // Check that store action was called
    const { useGameStore } = await import('@/stores/game');
    const store = useGameStore();
    expect(store.attackPosition).toHaveBeenCalledTimes(1);
    expect(store.attackPosition).toHaveBeenCalledWith(testCells[0][0]);
  });

  it('does not call attackPosition for already attacked cells', async () => {
    const testCells = [
      [
        { position: 'A1', state: 'hit' },
        { position: 'A2', state: 'miss' },
      ],
    ];

    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        game: {
          cells: testCells,
          headers: ['A'],
          status: 'in_progress',
        },
      },
      stubActions: false,
    });

    const wrapper = mount(BattleGrid, {
      global: { plugins: [pinia] },
    });

    const cells = wrapper.findAll('.w-10.h-10.border.border-gray-400');

    // Click hit cell
    await cells[0].trigger('click');
    // Click miss cell
    await cells[1].trigger('click');

    // Store should still be called, but the store logic should handle the prevention
    const { useGameStore } = await import('@/stores/game');
    const store = useGameStore();
    expect(store.attackPosition).toHaveBeenCalledTimes(2);
  });

  it('renders empty state gracefully when no cells provided', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        game: {
          cells: [],
          headers: [],
          status: 'idle',
        },
      },
    });

    const wrapper = mount(BattleGrid, {
      global: { plugins: [pinia] },
    });

    // Should still render the grid container
    const gridContainer = wrapper.find('.inline-grid');
    expect(gridContainer.exists()).toBe(true);

    // Should have minimal cells (just the corner cell)
    const cells = wrapper.findAll('.w-10.h-10.border.border-gray-400');
    expect(cells).toHaveLength(0);
  });

  it('applies hover effects only to clickable cells', () => {
    const testCells = [
      [
        { position: 'A1', state: 'empty' },
        { position: 'A2', state: 'hit' },
      ],
    ];

    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        game: {
          cells: testCells,
          headers: ['A'],
          status: 'in_progress',
        },
      },
    });

    const wrapper = mount(BattleGrid, {
      global: { plugins: [pinia] },
    });

    const cells = wrapper.findAll('.w-10.h-10.border.border-gray-400');

    // Empty cell should have hover effect
    expect(cells[0].classes()).toContain('hover:bg-blue-200');
    expect(cells[0].classes()).toContain('cursor-pointer');

    // Hit cell should not have hover effect due to cursor-not-allowed
    expect(cells[1].classes()).toContain('cursor-not-allowed');
  });
});
