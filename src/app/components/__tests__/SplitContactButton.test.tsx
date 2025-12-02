import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import SplitContactButton from '../SplitContactButton';
import fr from '../../../locales/fr.json';

describe('SplitContactButton', () => {
  it('should render without crashing', () => {
    render(<SplitContactButton messages={fr} />);
  });

  it('renders main contact button with correct label', () => {
    render(<SplitContactButton messages={fr} />);
    expect(screen.getByRole('button', { name: /Me contacter/i })).toBeInTheDocument();
  });

  it('shows split buttons after click', () => {
    jest.useFakeTimers();
    render(<SplitContactButton messages={fr} />);
    const mainBtn = screen.getByRole('button', { name: /Me contacter/i });
    fireEvent.click(mainBtn);
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    expect(screen.getByRole('button', { name: /E-mail/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Téléphone/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /WhatsApp/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Je vous recontacte/i })).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('calls onContactSelect when a split button is clicked', () => {
    jest.useFakeTimers();
    const onContactSelect = jest.fn();
    render(<SplitContactButton onContactSelect={onContactSelect} messages={fr} />);
    const mainBtn = screen.getByRole('button', { name: /Me contacter/i });
    fireEvent.click(mainBtn);
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    const emailBtn = screen.getByRole('button', { name: /E-mail/i });
    fireEvent.click(emailBtn);
    expect(onContactSelect).toHaveBeenCalledWith('email');
    jest.useRealTimers();
  });

  it('shows reset button after animation', () => {
    jest.useFakeTimers();
    render(<SplitContactButton messages={fr} />);
    const mainBtn = screen.getByRole('button', { name: /Me contacter/i });
    fireEvent.click(mainBtn);
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    expect(screen.getByRole('button', { name: /Fermer le menu de contact/i })).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('shows callback form when callback button is clicked', async () => {
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
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    jest.useRealTimers();
  });
});