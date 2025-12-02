import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Chevron from '../Chevron';

describe('Chevron', () => {
  it('should render without crashing', () => {
    render(<Chevron hovered={false} onMouseEnter={() => {}} onMouseLeave={() => {}} onClick={() => {}} />);
  });

  it('renders the SVG chevron', () => {
    render(<Chevron hovered={false} onMouseEnter={() => {}} onMouseLeave={() => {}} onClick={() => {}} />);
    expect(screen.getByTestId('chevron')).toBeInTheDocument();
    expect(screen.getByTestId('chevron').querySelector('svg')).toBeInTheDocument();
  });

  it('applies hovered style', () => {
    const { rerender } = render(<Chevron hovered={false} onMouseEnter={() => {}} onMouseLeave={() => {}} onClick={() => {}} />);
    const chevron = screen.getByTestId('chevron');
    expect(chevron.className).toContain('text-amber-600');
    rerender(<Chevron hovered={true} onMouseEnter={() => {}} onMouseLeave={() => {}} onClick={() => {}} />);
    expect(chevron.className).toContain('text-amber-800');
  });

  it('calls callbacks on interactions', () => {
    const onClick = jest.fn();
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();
    render(<Chevron hovered={false} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick} />);
    const chevron = screen.getByTestId('chevron');
    fireEvent.click(chevron);
    expect(onClick).toHaveBeenCalled();
    fireEvent.mouseEnter(chevron);
    expect(onMouseEnter).toHaveBeenCalled();
    fireEvent.mouseLeave(chevron);
    expect(onMouseLeave).toHaveBeenCalled();
  });
});