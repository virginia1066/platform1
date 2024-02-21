import { render, screen } from '@testing-library/react';
import { App } from './App';
import { Telegram } from "@twa-dev/types"

declare global {
  interface Window {
    Telegram: Telegram;
  }
}


test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
