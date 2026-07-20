import React from 'react';
import { mockPush, mockUsePathname } from '../../../test-utils/nextNavigationMock';
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
    expect(await screen.findByText('Clear ideas to shape a website that genuinely stands out.')).toBeInTheDocument();
    expect(await screen.findByText('A solution shaped around your goals, your business and the way you work.')).toBeInTheDocument();
    expect(await screen.findByText('A website designed to reflect your identity and values.')).toBeInTheDocument();
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
