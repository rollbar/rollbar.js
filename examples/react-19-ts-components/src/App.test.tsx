import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Rollbar Example for React', () => {
  render(<App />);
  const textElement = screen.getByText(/Rollbar Example for React/i);
  expect(textElement).toBeInTheDocument();
});
