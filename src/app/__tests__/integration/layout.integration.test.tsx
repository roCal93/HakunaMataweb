import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '../../[locale]/layout';

// Mock LanguageSwitcher
jest.mock('../../components/LanguageSwitcher', () => {
  return function MockLanguageSwitcher() {
    return <div>Mock Language Switcher</div>;
  };
});

describe('Intégration du layout', () => {
  it('affiche ses enfants correctement', async () => {
    // Call the layout as an async server component (it returns a React element)
    const rootElement = await Layout({
      children: <div data-testid="child">Contenu enfant</div>,
      params: Promise.resolve({ locale: 'fr' }),
    } as React.ComponentProps<typeof Layout>);

    // Layout returns an <html> element with two children: <head> and <body>.
    // Find the <body> element reliably even if children is an array.
    const htmlChildren = rootElement.props?.children;
    const body = Array.isArray(htmlChildren)
      ? htmlChildren.find((child: any) => child?.type === 'body')
      : htmlChildren?.type === 'body'
        ? htmlChildren
        : undefined;

    // The body directly contains the app children; unwrap them for rendering.
    const provider = body?.props?.children;
    const content = provider?.props?.children || provider;

    // If provider children contains several nodes (child + footer), prefer the actual child node
    let appContent = content;
    if (Array.isArray(content)) {
      appContent = content.find((c) => c?.props?.['data-testid'] === 'child') || content[0];
    }

    render(<>{appContent}</>);

    // Assertions
    // The data-testid prop may not be preserved through the server component call
    // (children can be serialized as DOM nodes), so rely on visible text instead.
    expect(screen.getByText(/Contenu enfant/i)).toBeInTheDocument();
  });
});
