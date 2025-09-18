import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import App from './App.vue';

describe('App', () => {
  it('renders the title correctly', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });
    expect(wrapper.text()).toContain('Battleship Demo');
  });

  it('displays game in progress message when status is in_progress', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              game: { status: 'in_progress' },
            },
          }),
        ],
      },
    });
    expect(wrapper.text()).toContain('Game in progress. Take your shot!');
  });

  it('displays win message when game is over', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              game: { status: 'game_over', ships: [] },
            },
          }),
        ],
      },
    });
    expect(wrapper.text()).toContain("Congratulations! You've won the game!");
  });

  it('renders child components', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });
    expect(wrapper.findComponent({ name: 'BattleGrid' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'BattleForm' }).exists()).toBe(true);
  });

  it('shows ship status when ships are present', () => {
    const mockShips = [
      { id: 1, type: 'battleShip', size: 5, hits: 2, isDestroyed: false, positions: [] },
    ];
    const wrapper = mount(App, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              game: { ships: mockShips },
            },
          }),
        ],
      },
    });
    expect(wrapper.text()).toContain('battleShip');
    expect(wrapper.text()).toContain('2/5');
  });
});
