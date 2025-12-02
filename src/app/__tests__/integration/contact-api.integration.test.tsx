import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
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

describe('Intégration API contact', () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  it('soumet le formulaire de rappel et affiche le message de succès', async () => {
    jest.useFakeTimers();
    render(<SplitContactButton messages={fr} />);
    const mainBtn = screen.getByRole('button', { name: /Me contacter/i });
    fireEvent.click(mainBtn);
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    const callbackBtn = screen.getByRole('button', { name: /Je vous recontacte/i });
    fireEvent.click(callbackBtn);
    act(() => {
      jest.advanceTimersByTime(800);
    });
    const nameInput = await screen.findByLabelText(/Nom complet/i);
    const emailInput = screen.getByLabelText(/Adresse email/i);
    const messageInput = screen.getByLabelText(/Message optionnel/i);
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Ceci est un message de test.' } });
    const submitBtn = screen.getByRole('button', { name: /Envoyer le formulaire/i });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByText(/Message bien reçu/i)).toBeInTheDocument();
    });
    jest.useRealTimers();
  });
});
