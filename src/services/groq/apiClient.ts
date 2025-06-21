
import { configService } from '../configService';
import type { 
  GroqResponse, 
  GroqChatMessage, 
  GroqCompletionConfig, 
  GroqStreamConfig 
} from '@/types/groq';

/**
 * Low-level Groq API client for making HTTP requests
 */
export class GroqApiClient {
  private static readonly BASE_URL = 'https://api.groq.com/openai/v1';

  /**
   * Validates that API key is configured
   */
  static validateApiKey(): void {
    const apiKey = configService.getGroqKey();
    if (!apiKey) {
      throw new Error('Groq API key not configured');
    }
  }

  /**
   * Creates headers for API requests
   */
  static createHeaders(): HeadersInit {
    const apiKey = configService.getGroqKey();
    return {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Makes a completion request to Groq API
   */
  static async makeCompletionRequest(config: GroqCompletionConfig): Promise<GroqResponse> {
    this.validateApiKey();

    const response = await fetch(`${this.BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: this.createHeaders(),
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Makes a streaming request to Groq API
   */
  static async makeStreamingRequest(config: GroqStreamConfig): Promise<Response> {
    this.validateApiKey();

    const response = await fetch(`${this.BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: this.createHeaders(),
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  /**
   * Builds message array for API request
   */
  static buildMessages(
    userMessage: string,
    conversationHistory: GroqChatMessage[],
    systemPrompt: string
  ): GroqChatMessage[] {
    return [
      {
        role: 'system',
        content: systemPrompt
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage
      }
    ];
  }
}
