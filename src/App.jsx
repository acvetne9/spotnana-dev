import React, { useState, useRef } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { initChat, sendMessage, streamText } from './services/api';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const stopStream = useRef(null);

  const handleSetKey = () => {
    if (apiKey.trim()) {
      initChat(apiKey.trim());
      setIsReady(true);
    }
  };

  const handleSend = async (content) => {
    setMessages(prev => [...prev, { role: 'user', content }]);
    setIsLoading(true);

    try {
      const response = await sendMessage(content, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      let text = '';
      stopStream.current = streamText(response, (char) => {
        text += char;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: text };
          return updated;
        });
      }, () => setIsLoading(false));
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + err.message }]);
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    stopStream.current?.();
    setMessages([]);
    setIsLoading(false);
  };

  if (!isReady) {
    return (
      <div>
        <h2>Enter Gemini API Key</h2>
        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="API key..."
        />
        <button onClick={handleSetKey}>Start</button>
      </div>
    );
  }

  return (
    <div>
      <header>
        <h1>AI Chat</h1>
        <button onClick={handleClear}>Clear</button>
      </header>

      <main>
        {messages.length === 0 ? (
          <p>Start a conversation</p>
        ) : (
          messages.map((msg, i) => <ChatMessage key={i} message={msg} />)
        )}
      </main>

      <footer>
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </footer>
    </div>
  );
}

export default App;
