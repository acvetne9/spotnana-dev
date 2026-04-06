import { GoogleGenerativeAI } from '@google/generative-ai';

let chat = null;

export function initChat(apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  chat = model.startChat();
}

export async function sendMessage(message) {
  if (!chat) throw new Error('Set API key first');
  const result = await chat.sendMessage(message);
  return result.response.text();
}

export function streamText(text, onChar, onDone) {
  let i = 0;
  const id = setInterval(() => {
    if (i < text.length) onChar(text[i++]);
    else { clearInterval(id); onDone?.(); }
  }, 20);
  return () => clearInterval(id);
}
