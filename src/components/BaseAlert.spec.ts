import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseAlert from './BaseAlert.vue';

describe('BaseAlert', () => {
  it('renders title and description correctly', () => {
    const wrapper = mount(BaseAlert, {
      props: {
        title: 'Test Title',
        description: 'Test Description',
      },
    });

    expect(wrapper.text()).toContain('Test Title');
    expect(wrapper.text()).toContain('Test Description');
  });

  it('applies default info variant styles', () => {
    const wrapper = mount(BaseAlert, {
      props: {
        title: 'Info Alert',
        description: 'This is an info alert',
      },
    });

    const alertDiv = wrapper.find('div');
    expect(alertDiv.classes()).toContain('bg-blue-50');
    expect(alertDiv.classes()).toContain('text-blue-700');
  });

  it('handles all variant types correctly', () => {
    const variants = [
      { variant: 'info', bgClass: 'bg-blue-50', textClass: 'text-blue-700' },
      { variant: 'warning', bgClass: 'bg-yellow-50', textClass: 'text-yellow-700' },
      { variant: 'error', bgClass: 'bg-red-50', textClass: 'text-red-700' },
    ];

    variants.forEach(({ variant, bgClass, textClass }) => {
      const wrapper = mount(BaseAlert, {
        props: {
          title: `${variant} alert`,
          description: `This is a ${variant} alert`,
          variant: variant as 'info' | 'warning' | 'error',
        },
      });

      const alertDiv = wrapper.find('div');
      expect(alertDiv.classes()).toContain(bgClass);
      expect(alertDiv.classes()).toContain(textClass);
    });
  });
});
