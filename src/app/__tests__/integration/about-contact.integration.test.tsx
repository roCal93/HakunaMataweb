import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import AboutCards from '../../components/AboutCards';
import SplitContactButton from '../../components/SplitContactButton';
import fr from '../../../locales/fr.json';

describe('Intégration AboutCards + SplitContactButton', () => {
  it('affiche les cartes et le bouton contact', async () => {
    render(
      <>
        <AboutCards messages={fr} />
        <SplitContactButton messages={fr} />
      </>
    );
    expect(await screen.findByText('Des idées claires pour concevoir un site qui se démarque vraiment.')).toBeInTheDocument();
    expect(await screen.findByText('Une solution pensée pour vos objectifs, votre activité et votre manière de travailler.')).toBeInTheDocument();
    expect(await screen.findByText('Un site pensé pour refléter votre identité et vos valeurs.')).toBeInTheDocument();
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
