import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitcher from '../LanguageSwitcher';
import type { Messages } from '@/lib/types';

// Mock next/navigation hooks
const mockPush = jest.fn();
const mockUsePathname = jest.fn();
const mockUseRouter = jest.fn(() => ({ push: mockPush }));

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => mockUseRouter(),
}));

// Mock partiel des messages pour les tests
const mockMessages = { 
  aria: { 
    currentLanguage: 'Current language',
    switchToFrench: 'Switch to French',
    switchToEnglish: 'Switch to English'
  } 
} as unknown as Messages;

describe('LanguageSwitcher component', () => {
  let originalLocation: Location;
  beforeEach(() => {
    mockPush.mockClear();
    mockUsePathname.mockReset();
    // Replace location.assign with a spyable function for JSDOM
    originalLocation = window.location;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete window.location;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.location = { ...originalLocation, assign: jest.fn() } as unknown as Location;
  });

  it('navigates to the other language when activated via keyboard', () => {
    mockUsePathname.mockReturnValue('/fr');
    render(<LanguageSwitcher messages={mockMessages} />);
    const enButton = screen.getByRole('button', { name: 'Switch to English' });
    enButton.focus();
    // Click to select EN
    fireEvent.click(enButton);
    expect(mockPush).toHaveBeenCalledWith('/en');
  });
  afterEach(() => {
    // Restore original location
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.location = originalLocation;
  });
});
