import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import AboutCards from '../../components/AboutCards';
import SplitContactButton from '../../components/SplitContactButton';
import fr from '../../../locales/fr.json';

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

describe('Intégration AboutCards + SplitContactButton', () => {
  it('affiche les cartes et le bouton contact', async () => {
    render(
      <>
        <AboutCards messages={fr} />
        <SplitContactButton messages={fr} />
      </>
    );
    expect(await screen.findByText("L'innovation au service de votre projet.")).toBeInTheDocument();
    expect(await screen.findByText('Des solutions précises et adaptées à vos besoins.')).toBeInTheDocument();
    expect(await screen.findByText('Un site qui reflète vos valeurs et votre identité.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Me contacter/i })).toBeInTheDocument();
  });

  it('interaction : bouton contact split', async () => {
    jest.useFakeTimers();
    render(
      <SplitContactButton messages={fr} />
    );
    const btn = screen.getByRole('button', { name: /Me contacter/i });
    fireEvent.click(btn);
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /E-mail/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Téléphone/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /WhatsApp/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Je vous recontacte/i })).toBeInTheDocument();
    });
    jest.useRealTimers();
  });
});
