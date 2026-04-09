import React, { useState } from 'react';

function ChatInput({ onSend, onClear, disabled }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !input.trim()}>Send</button>
      <button type="button" className="clear-btn" onClick={onClear}>Clear</button>
    </form>
  );
}

export default ChatInput;
