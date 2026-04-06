import React from 'react';

function ChatMessage({ message }) {
  return (
    <div className={`message ${message.role}`}>
      <div className="message-bubble">{message.content}</div>
    </div>
  );
}

export default ChatMessage;
