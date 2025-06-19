
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

interface GroqContextualResponse {
  response: string;
  confidence: number;
  context: GroqContext;
}

interface GroqContext {
  intent?: string;
  routeDatabase?: any[];
  userPreferences?: any;
  conversationHistory?: any[];
  currentShipment?: any;
}

/**
 * DeepTalkGroqService - AI-powered logistics assistant service
 * Provides intelligent responses using Groq's API with OpenAI compatibility
 */
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

  /**
   * Updates the Groq API key
   */
  setApiKey(apiKey: string): void {
    configService.updateKeys(undefined, apiKey);
  }

  /**
   * Gets the default system prompt for DeepCAL AI
   */
  private getSystemPrompt(): string {
    return 'You are DeepCAL AI, an advanced logistics and freight optimization assistant. You specialize in supply chain intelligence, route optimization, and freight analytics. Provide intelligent, data-driven responses about logistics, shipping, and supply chain optimization. Be conversational but authoritative.';
  }

  /**
   * Builds a context-aware system prompt based on available data
   */
  private buildSystemPrompt(context: GroqContext): string {
    const { intent, routeDatabase, userPreferences } = context;
    
    let prompt = this.getSystemPrompt();
    
    if (routeDatabase && routeDatabase.length > 0) {
      prompt += `\n\nAvailable routes: ${JSON.stringify(routeDatabase.slice(0, 3))}`;
    }
    
    if (intent) {
      prompt += `\n\nUser intent: ${intent}`;
    }
    
    if (userPreferences) {
      prompt += `\n\nUser preferences: ${JSON.stringify(userPreferences)}`;
    }
    
    return prompt;
  }

  /**
   * Generates a contextual response using Groq AI
   */
  async generateResponse(query: string, context: GroqContext): Promise<GroqContextualResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      const response = await this.sendMessage(query, [], 'llama3-8b-8192', systemPrompt);
      
      return {
        response,
        confidence: 0.9,
        context: context
      };
    } catch (error) {
      console.error('Generate response error:', error);
      throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Sends a message to Groq API and returns the response
   */
  async sendMessage(
    message: string,
    conversationHistory: GroqChatMessage[] = [],
    model: string = 'llama3-8b-8192',
    systemPrompt: string = this.getSystemPrompt()
  ): Promise<string> {
    try {
      const apiKey = configService.getGroqKey();
      
      if (!apiKey) {
        throw new Error('Groq API key not configured');
      }
      
      const messages: GroqChatMessage[] = [
        {
          role: 'system',
          content: systemPrompt
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
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const data: GroqResponse = await response.json();
      return data.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('DeepTalk Groq service error:', error);
      throw new Error(`Failed to get response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Streams a message response from Groq API
   */
  async streamMessage(
    message: string,
    conversationHistory: GroqChatMessage[] = [],
    onChunk: (chunk: string) => void,
    model: string = 'llama3-8b-8192',
    systemPrompt: string = this.getSystemPrompt()
  ): Promise<void> {
    try {
      const apiKey = configService.getGroqKey();
      
      if (!apiKey) {
        throw new Error('Groq API key not configured');
      }
      
      const messages: GroqChatMessage[] = [
        {
          role: 'system',
          content: systemPrompt
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
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
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
              // Skip invalid JSON lines - this is normal with streaming
              console.debug('Skipped invalid streaming JSON:', trimmed);
            }
          }
        }
      }
    } catch (error) {
      console.error('DeepTalk Groq stream error:', error);
      throw new Error(`Failed to stream response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Checks if the service is properly configured with API key
   */
  isConfigured(): boolean {
    const apiKey = configService.getGroqKey();
    return Boolean(apiKey && apiKey.length > 0);
  }
}

export const deepTalkGroqService = DeepTalkGroqService.getInstance();
export type { GroqChatMessage, GroqContext, GroqContextualResponse };
