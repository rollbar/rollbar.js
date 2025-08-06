import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Rollbar Example for React', () => {
  render(<App />);
  const linkElement = screen.getByText(/Rollbar Example for React/i);
  expect(linkElement).toBeInTheDocument();
});
