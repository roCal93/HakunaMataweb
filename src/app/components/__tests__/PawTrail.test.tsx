import React from 'react';
import { render, screen } from '@testing-library/react';
import PawTrail from '../PawTrail';

describe('PawTrail', () => {
  it('should render without crashing', () => {
    render(<PawTrail />);
  });

  it('renders no paw images initially', () => {
    render(<PawTrail />);
    expect(screen.queryByAltText('paw')).toBeNull();
  });


  it('accepts custom src and size props', () => {
    render(<PawTrail src="/images/test.png" size={42} />);
    // Le rendu initial ne montre pas de patte, mais on vérifie que le composant ne plante pas
    expect(screen.queryByAltText('paw')).toBeNull();
  });
});