import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { mockPush, mockUsePathname } from '../../../test-utils/nextNavigationMock';
import LanguageSwitcher from '../LanguageSwitcher';
import type { Messages } from '@/lib/types';

// Mock partiel des messages pour les tests
const mockMessages = { 
  aria: { 
    currentLanguage: 'Current language',
    switchToFrench: 'Switch to French',
    switchToEnglish: 'Switch to English'
  } 
} as unknown as Messages;

describe('LanguageSwitcher component', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockUsePathname.mockReset();
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
});
