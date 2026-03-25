import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

test('renders default title "Indecision" when no title prop is passed', () => {
  render(<Header />);
  expect(screen.getByText('Indecision')).toBeInTheDocument();
});

test('renders custom title when title prop is provided', () => {
  render(<Header title="My App" />);
  expect(screen.getByText('My App')).toBeInTheDocument();
});
