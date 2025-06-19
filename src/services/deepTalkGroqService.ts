
import { configService } from './configService';

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface GroqChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class DeepTalkGroqService {
  private static instance: DeepTalkGroqService;
  private baseURL = 'https://api.groq.com/openai/v1';

  private constructor() {}

  public static getInstance(): DeepTalkGroqService {
    if (!DeepTalkGroqService.instance) {
      DeepTalkGroqService.instance = new DeepTalkGroqService();
    }
    return DeepTalkGroqService.instance;
  }

  async sendMessage(
    message: string,
    conversationHistory: GroqChatMessage[] = [],
    model: string = 'llama3-8b-8192'
  ): Promise<string> {
    try {
      const apiKey = configService.getGroqKey();
      
      const messages: GroqChatMessage[] = [
        {
          role: 'system',
          content: 'You are DeepCAL AI, an advanced logistics and freight optimization assistant. You specialize in supply chain intelligence, route optimization, and freight analytics. Provide intelligent, data-driven responses about logistics, shipping, and supply chain optimization.'
        },
        ...conversationHistory,
        {
          role: 'user',
          content: message
        }
      ];

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1024,
          top_p: 1,
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data: GroqResponse = await response.json();
      return data.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('DeepTalk Groq service error:', error);
      throw new Error(`Failed to get response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async streamMessage(
    message: string,
    conversationHistory: GroqChatMessage[] = [],
    onChunk: (chunk: string) => void,
    model: string = 'llama3-8b-8192'
  ): Promise<void> {
    try {
      const apiKey = configService.getGroqKey();
      
      const messages: GroqChatMessage[] = [
        {
          role: 'system',
          content: 'You are DeepCAL AI, an advanced logistics and freight optimization assistant. Provide intelligent, data-driven responses about logistics, shipping, and supply chain optimization.'
        },
        ...conversationHistory,
        {
          role: 'user',
          content: message
        }
      ];

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1024,
          top_p: 1,
          stream: true
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
            try {
              const jsonStr = trimmed.slice(6);
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      }
    } catch (error) {
      console.error('DeepTalk Groq stream error:', error);
      throw error;
    }
  }

  isConfigured(): boolean {
    const apiKey = configService.getGroqKey();
    return Boolean(apiKey && apiKey.length > 0);
  }
}

export const deepTalkGroqService = DeepTalkGroqService.getInstance();
export type { GroqChatMessage };
