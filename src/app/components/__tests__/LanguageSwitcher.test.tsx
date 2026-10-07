import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockUsePathname } from '../../../test-utils/nextNavigationMock';
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
    mockUsePathname.mockReset();
  });

  it('provides a native link to the other language', () => {
    mockUsePathname.mockReturnValue('/fr');
    render(<LanguageSwitcher messages={mockMessages} />);
    expect(screen.getByRole('link', { name: 'Switch to English' })).toHaveAttribute('href', '/en');
  });
});
