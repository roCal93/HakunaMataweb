import React from 'react';
// Mock next/navigation hooks
const mockPush = jest.fn();
const mockUsePathname = jest.fn();
const mockUseRouter = jest.fn(() => ({ push: mockPush }));

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => mockUseRouter(),
}));

// Mock IntersectionObserver
beforeAll(() => {
  global.IntersectionObserver = class {
    constructor() {}
    root = null;
    rootMargin = '';
    thresholds = [];
    takeRecords() { return []; }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { CircularHero } from '../../components/CircularHero';
import AboutCards from '../../components/AboutCards';
import SplitContactButton from '../../components/SplitContactButton';
import en from '../../../locales/en.json';

describe('Intégration de la page principale', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockUsePathname.mockReturnValue('/en');
  });

  it('affiche les composants principaux', async () => {
    render(
      <>
        <CircularHero messages={en} />
        <AboutCards messages={en} />
        <SplitContactButton messages={en} />
      </>
    );
    expect(screen.getByRole('button', { name: /Contact me/i })).toBeInTheDocument();
    // Attend l'apparition des textes des cartes About (corrected text from en.json)
    expect(await screen.findByText('Innovation at the service of your project.')).toBeInTheDocument();
    expect(await screen.findByText('Precise solutions adapted to your needs.')).toBeInTheDocument();
    expect(await screen.findByText('A site that reflects your values and identity.')).toBeInTheDocument();
  });

  it('interaction : bouton contact ouvre les options', async () => {
    jest.useFakeTimers();
    render(
      <SplitContactButton messages={en} />
    );
    const btn = screen.getByRole('button', { name: /Contact me/i });
    fireEvent.click(btn);
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /E-mail/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Phone/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /WhatsApp/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /I'll call you back/i })).toBeInTheDocument();
    });
    jest.useRealTimers();
  });
});
