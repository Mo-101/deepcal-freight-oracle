
import { configService } from './configService';
import { GroqPromptBuilder } from './groq/promptBuilder';
import { GroqStreamParser } from './groq/streamParser';
import { GroqApiClient } from './groq/apiClient';
import type { 
  GroqChatMessage, 
  GroqContext, 
  GroqContextualResponse 
} from '@/types/groq';

/**
 * DeepTalkGroqService - AI-powered logistics assistant service
 * Provides intelligent responses using Groq's API with OpenAI compatibility
 */
class DeepTalkGroqService {
  private static instance: DeepTalkGroqService;

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
   * Generates a contextual response using Groq AI
   */
  async generateResponse(query: string, context: GroqContext): Promise<GroqContextualResponse> {
    try {
      const systemPrompt = GroqPromptBuilder.buildContextualSystemPrompt(context);
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
    systemPrompt: string = GroqPromptBuilder.getDefaultSystemPrompt()
  ): Promise<string> {
    try {
      const messages = GroqApiClient.buildMessages(message, conversationHistory, systemPrompt);

      const config = {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false as const
      };

      const data = await GroqApiClient.makeCompletionRequest(config);
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
    systemPrompt: string = GroqPromptBuilder.getDefaultSystemPrompt()
  ): Promise<void> {
    try {
      const messages = GroqApiClient.buildMessages(message, conversationHistory, systemPrompt);

      const config = {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: true as const
      };

      const response = await GroqApiClient.makeStreamingRequest(config);
      await GroqStreamParser.parseStream(response, onChunk);
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
