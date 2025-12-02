import React from 'react';
import Layout from '../[locale]/layout';

// Mock LanguageSwitcher
jest.mock('../components/LanguageSwitcher', () => {
  return function MockLanguageSwitcher() {
    return <div>Mock Language Switcher</div>;
  };
});

describe('Layout', () => {
  it('sets the <html> lang attribute based on locale', async () => {
     const element = await Layout({ params: Promise.resolve({ locale: 'en' }), children: <div>Test</div> });
     expect(element.props.lang).toBe('en');
  });
});