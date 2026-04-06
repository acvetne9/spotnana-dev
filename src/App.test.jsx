import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Mock API service
vi.mock('./services/api', () => ({
  initChat: vi.fn(),
  sendMessage: vi.fn().mockResolvedValue('Hello from AI'),
  streamText: vi.fn((text, onChar, onDone) => {
    text.split('').forEach((char, i) => {
      setTimeout(() => onChar(char), i * 5);
    });
    setTimeout(onDone, text.length * 5 + 10);
    return vi.fn();
  })
}));

// Mock environment variable
vi.stubEnv('VITE_GEMINI_API_KEY', 'test-api-key');

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders chat interface', () => {
    render(<App />);
    expect(screen.getByText('AndreasGPT')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
  });

  it('displays user message after sending', async () => {
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Type your message...'), {
      target: { value: 'Hello' }
    });
    fireEvent.click(screen.getByText('Send'));

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });

  it('disables input while loading', async () => {
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Type your message...'), {
      target: { value: 'Hello' }
    });
    fireEvent.click(screen.getByText('Send'));

    // Input should be disabled during loading
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type your message...')).toBeDisabled();
    });
  });
});
