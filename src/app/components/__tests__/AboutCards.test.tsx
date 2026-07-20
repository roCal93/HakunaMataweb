import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AboutCards from '../AboutCards';
import fr from '../../../locales/fr.json';

const originalMatchMedia = window.matchMedia;

describe('AboutCards', () => {
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('should render without crashing', () => {
    render(<AboutCards messages={fr} />);
  });
  it('renders all cards with correct images and texts', () => {
    render(<AboutCards messages={fr} />);
    expect(screen.getByText('Des idées claires pour concevoir un site qui se démarque vraiment.')).toBeInTheDocument();
    expect(screen.getByText('Une solution pensée pour vos objectifs, votre activité et votre manière de travailler.')).toBeInTheDocument();
    expect(screen.getByText('Un site pensé pour refléter votre identité et vos valeurs.')).toBeInTheDocument();
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
    expect(screen.getByText('Des idées claires pour concevoir un site qui se démarque vraiment.')).toBeInTheDocument();
    expect(screen.getByText('Une solution pensée pour vos objectifs, votre activité et votre manière de travailler.')).toBeInTheDocument();
    expect(screen.getByText('Un site pensé pour refléter votre identité et vos valeurs.')).toBeInTheDocument();
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