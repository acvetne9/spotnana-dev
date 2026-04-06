import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

let model = null;

export function initChat(apiKey) {
  model = new ChatGoogleGenerativeAI({ apiKey, model: 'gemini-2.0-flash' });
}

export async function sendMessage(message, history) {
  if (!model) throw new Error('Set API key first');

  const messages = history.map(m =>
    m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
  );
  messages.push(new HumanMessage(message));

  const response = await model.invoke(messages);
  return response.content;
}

export function streamText(text, onChar, onDone) {
  let i = 0;
  const id = setInterval(() => {
    if (i < text.length) onChar(text[i++]);
    else { clearInterval(id); onDone?.(); }
  }, 20);
  return () => clearInterval(id);
}
