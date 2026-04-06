import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ChatInput from './ChatInput';

describe('ChatInput', () => {
  it('renders input and button', () => {
    render(<ChatInput onSend={() => {}} disabled={false} />);
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  it('calls onSend with input value on submit', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={false} />);

    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.submit(input.closest('form'));

    expect(onSend).toHaveBeenCalledWith('Hello');
  });

  it('clears input after submit', () => {
    render(<ChatInput onSend={() => {}} disabled={false} />);

    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.submit(input.closest('form'));

    expect(input.value).toBe('');
  });

  it('does not submit empty input', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={false} />);

    fireEvent.submit(screen.getByRole('button', { name: 'Send' }).closest('form'));

    expect(onSend).not.toHaveBeenCalled();
  });

  it('disables input and button when disabled prop is true', () => {
    render(<ChatInput onSend={() => {}} disabled={true} />);

    expect(screen.getByPlaceholderText('Type your message...')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });
});
