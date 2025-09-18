import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseButton from './BaseButton.vue';

describe('BaseButton', () => {
  it('renders slot content correctly', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click Me',
      },
    });

    expect(wrapper.text()).toContain('Click Me');
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('applies primary variant styles by default', () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Primary Button' },
    });

    const button = wrapper.find('button');
    expect(button.classes()).toContain('bg-red-600');
  });

  it('applies secondary variant styles when specified', () => {
    const wrapper = mount(BaseButton, {
      props: {
        variant: 'secondary',
      },
      slots: { default: 'Secondary Button' },
    });

    const button = wrapper.find('button');
    expect(button.classes()).toContain('bg-gray-500');
  });

  it('is not disabled by default', () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Enabled Button' },
    });

    const button = wrapper.find('button');
    expect(button.attributes('disabled')).toBeUndefined();
  });

  it('emits click event when clicked', async () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Clickable Button' },
    });

    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted('click')).toBeTruthy();
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('does not emit click event when disabled and clicked', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true,
      },
      slots: { default: 'Disabled Button' },
    });

    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted('click')).toBeFalsy();
  });
});
