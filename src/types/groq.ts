
export interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface GroqChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqContextualResponse {
  response: string;
  confidence: number;
  context: GroqContext;
}

export interface GroqContext {
  intent?: string;
  routeDatabase?: any[];
  userPreferences?: any;
  conversationHistory?: any[];
  currentShipment?: any;
}

export interface GroqStreamConfig {
  model: string;
  messages: GroqChatMessage[];
  temperature: number;
  max_tokens: number;
  top_p: number;
  stream: boolean;
}

export interface GroqCompletionConfig extends Omit<GroqStreamConfig, 'stream'> {
  stream: false;
}
