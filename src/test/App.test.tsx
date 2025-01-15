import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // For better matchers like `toBeInTheDocument`
import App from '../App';

describe('App Component', () => {
  it('renders the "Hello" text', () => {
    render(<App />);
    const helloElement = screen.getByText(/hello/i); // Case-insensitive match
    expect(helloElement).toBeInTheDocument();
  });
});