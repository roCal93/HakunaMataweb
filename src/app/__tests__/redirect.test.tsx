import React from 'react';
import { redirect } from 'next/navigation';
import Home from '../(redirect)/page';
import RedirectLayout from '../(redirect)/layout';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

describe('Root redirect route', () => {
  it('redirects to the French homepage', () => {
    expect(() => Home()).toThrow('NEXT_REDIRECT');
    expect(redirect).toHaveBeenCalledWith('/fr');
  });

  it('provides a root document layout', () => {
    const children = <div>Test</div>;
    const element = RedirectLayout({ children });

    expect(element.type).toBe('html');
    expect(element.props.lang).toBe('fr');
    expect(element.props.children.type).toBe('body');
    expect(element.props.children.props.children).toBe(children);
  });
});