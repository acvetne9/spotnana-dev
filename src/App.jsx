import { useState } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);

  const handleSend = (content) => {
    setMessages((prev) => [...prev, { role: 'user', content }]);
  };

  const handleClear = () => {
    setMessages([]);
  };

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
        <ChatInput onSend={handleSend} disabled={false} />
      </footer>
    </div>
  );
}

export default App;
