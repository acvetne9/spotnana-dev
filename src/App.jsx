import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { initChat, sendMessage, streamText } from './services/api';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const stopStream = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      initChat(apiKey);
    } else {
      setError('Missing API key. Add VITE_GEMINI_API_KEY to .env file.');
    }
  }, []);

  const handleSend = async (content) => {
    setMessages(prev => [...prev, { role: 'user', content }]);
    setIsLoading(true);

    try {
      const response = await sendMessage(content);
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

  if (error) {
    return <div><p>{error}</p></div>;
  }

  return (
    <div>
      <header>
        <h1>AndreasGPT</h1>
      </header>

      <main>
        {messages.map((msg, i) => <ChatMessage key={i} message={msg} />)}
        {isLoading && <div className="loading"><span></span><span></span><span></span></div>}
        <div ref={messagesEndRef} />
      </main>

      <footer>
        <ChatInput onSend={handleSend} onClear={handleClear} disabled={isLoading} />
      </footer>
    </div>
  );
}

export default App;
