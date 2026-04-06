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

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders API key input initially', () => {
    render(<App />);
    expect(screen.getByText('Enter Gemini API Key')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('API key...')).toBeInTheDocument();
  });

  it('shows chat interface after setting API key', () => {
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('API key...'), {
      target: { value: 'test-key' }
    });
    fireEvent.click(screen.getByText('Start'));

    expect(screen.getByText('AI Chat')).toBeInTheDocument();
    expect(screen.getByText('Start a conversation')).toBeInTheDocument();
  });

  it('does not proceed with empty API key', () => {
    render(<App />);

    fireEvent.click(screen.getByText('Start'));

    expect(screen.getByText('Enter Gemini API Key')).toBeInTheDocument();
  });

  it('displays user message after sending', async () => {
    render(<App />);

    // Set API key
    fireEvent.change(screen.getByPlaceholderText('API key...'), {
      target: { value: 'test-key' }
    });
    fireEvent.click(screen.getByText('Start'));

    // Send message
    fireEvent.change(screen.getByPlaceholderText('Type your message...'), {
      target: { value: 'Hello' }
    });
    fireEvent.click(screen.getByText('Send'));

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });

  it('clears messages when clear button is clicked', async () => {
    render(<App />);

    // Set API key
    fireEvent.change(screen.getByPlaceholderText('API key...'), {
      target: { value: 'test-key' }
    });
    fireEvent.click(screen.getByText('Start'));

    // Send message
    fireEvent.change(screen.getByPlaceholderText('Type your message...'), {
      target: { value: 'Hello' }
    });
    fireEvent.click(screen.getByText('Send'));

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    // Clear
    fireEvent.click(screen.getByText('Clear'));

    expect(screen.getByText('Start a conversation')).toBeInTheDocument();
  });
});
