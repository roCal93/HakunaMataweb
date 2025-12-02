import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AboutCards from '../AboutCards';
import fr from '../../../locales/fr.json';

// Mock IntersectionObserver
beforeAll(() => {
  global.IntersectionObserver = class {
    constructor() {}
    root: Element | null = null;
    rootMargin: string = '';
    thresholds: ReadonlyArray<number> = [];
    takeRecords(): IntersectionObserverEntry[] { return []; }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('AboutCards', () => {
  it('should render without crashing', () => {
    render(<AboutCards messages={fr} />);
  });
  it('renders all cards with correct images and texts', () => {
    render(<AboutCards messages={fr} />);
    expect(screen.getByText("L'innovation au service de votre projet.")).toBeInTheDocument();
    expect(screen.getByText('Des solutions précises et adaptées à vos besoins.')).toBeInTheDocument();
    expect(screen.getByText('Un site qui reflète vos valeurs et votre identité.')).toBeInTheDocument();
  });

  it('renders buttons in touch mode and flips card on click', () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn()
    }));
    render(<AboutCards messages={fr} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(3);
    fireEvent.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders images and texts in non-touch mode', () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn()
    }));
    render(<AboutCards messages={fr} />);
    expect(screen.getByText("L'innovation au service de votre projet.")).toBeInTheDocument();
    expect(screen.getByText('Des solutions précises et adaptées à vos besoins.')).toBeInTheDocument();
    expect(screen.getByText('Un site qui reflète vos valeurs et votre identité.')).toBeInTheDocument();
  });

  it('has accessible roles and attributes', () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn()
    }));
    render(<AboutCards messages={fr} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => {
      expect(btn).toHaveAttribute('role', 'button');
      expect(btn).toHaveAttribute('aria-pressed');
    });
  });
});