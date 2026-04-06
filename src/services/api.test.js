import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initChat, sendMessage, streamText } from './api';

// Mock Google Generative AI
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      startChat: vi.fn().mockReturnValue({
        sendMessage: vi.fn().mockResolvedValue({
          response: { text: () => 'Hello from AI' }
        })
      })
    })
  }))
}));

describe('api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initChat', () => {
    it('initializes the chat model with API key', () => {
      expect(() => initChat('test-api-key')).not.toThrow();
    });
  });

  describe('sendMessage', () => {
    it('throws error if chat not initialized', async () => {
      vi.resetModules();
      const { sendMessage: freshSendMessage } = await import('./api');
      await expect(freshSendMessage('hello')).rejects.toThrow('Set API key first');
    });

    it('returns response from AI', async () => {
      initChat('test-key');
      const response = await sendMessage('hello');
      expect(response).toBe('Hello from AI');
    });
  });

  describe('streamText', () => {
    it('calls onChar for each character', async () => {
      const onChar = vi.fn();
      const onDone = vi.fn();

      streamText('Hi', onChar, onDone);

      await new Promise(r => setTimeout(r, 100));

      expect(onChar).toHaveBeenCalledWith('H');
      expect(onChar).toHaveBeenCalledWith('i');
    });

    it('calls onDone when complete', async () => {
      const onChar = vi.fn();
      const onDone = vi.fn();

      streamText('Hi', onChar, onDone);

      await new Promise(r => setTimeout(r, 100));

      expect(onDone).toHaveBeenCalled();
    });

    it('returns cleanup function that stops streaming', async () => {
      const onChar = vi.fn();
      const cleanup = streamText('Hello World', onChar, () => {});

      await new Promise(r => setTimeout(r, 30));
      cleanup();
      const callCount = onChar.mock.calls.length;

      await new Promise(r => setTimeout(r, 100));
      expect(onChar.mock.calls.length).toBe(callCount);
    });
  });
});
