import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ChatMessage from './ChatMessage';

describe('ChatMessage', () => {
  it('renders user message content', () => {
    render(<ChatMessage message={{ role: 'user', content: 'Hello' }} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders assistant message content', () => {
    render(<ChatMessage message={{ role: 'assistant', content: 'Hi there' }} />);
    expect(screen.getByText('Hi there')).toBeInTheDocument();
  });

  it('applies correct class for user role', () => {
    const { container } = render(<ChatMessage message={{ role: 'user', content: 'Test' }} />);
    expect(container.firstChild).toHaveClass('user');
  });

  it('applies correct class for assistant role', () => {
    const { container } = render(<ChatMessage message={{ role: 'assistant', content: 'Test' }} />);
    expect(container.firstChild).toHaveClass('assistant');
  });
});
