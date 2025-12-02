import React from 'react';
import Page from '../[locale]/page';

describe('Page', () => {
  it('selects the english copy when locale=en', async () => {
    const element = await Page({ params: Promise.resolve({ locale: 'en' }) });
    expect(element.props.messages.home.title).toBe('Hakuna Mataweb');
  });
});