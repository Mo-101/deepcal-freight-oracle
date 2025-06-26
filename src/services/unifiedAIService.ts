
interface AIProvider {
  name: string;
  endpoint: string;
  models: string[];
  supportsVoice: boolean;
}

interface AIConfig {
  provider: 'openai' | 'groq' | 'claude' | 'mixtral';
  model: string;
  temperature: number; // creativity 0-1
  maxTokens: number; // response length
  contextWindow: number;
  apiKey?: string;
}

interface AIResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: string;
}

class UnifiedAIService {
  private config: AIConfig = {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 800,
    contextWindow: 8000
  };

  private providers: Record<string, AIProvider> = {
    openai: {
      name: 'OpenAI GPT-4',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
      supportsVoice: true
    },
    groq: {
      name: 'Groq Llama',
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      models: ['llama3-70b-8192', 'mixtral-8x7b-32768'],
      supportsVoice: false
    }
  };

  constructor() {
    // Auto-load configuration on initialization
    this.loadConfig();
  }

  updateConfig(newConfig: Partial<AIConfig>) {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('ai-config', JSON.stringify(this.config));
    console.log('🤖 AI Configuration updated:', this.config);
  }

  loadConfig() {
    const saved = localStorage.getItem('ai-config');
    if (saved) {
      this.config = { ...this.config, ...JSON.parse(saved) };
    }
    
    // Load API keys from localStorage
    const openaiKey = localStorage.getItem('openai-api-key');
    const groqKey = localStorage.getItem('groq-api-key');
    
    if (openaiKey && this.config.provider === 'openai') {
      this.config.apiKey = openaiKey;
    } else if (groqKey && this.config.provider === 'groq') {
      this.config.apiKey = groqKey;
    }

    console.log('🤖 AI Service initialized with config:', {
      provider: this.config.provider,
      model: this.config.model,
      hasApiKey: !!this.config.apiKey
    });
  }

  async generateResponse(messages: any[], context?: any): Promise<AIResponse> {
    const provider = this.providers[this.config.provider];
    
    if (!this.config.apiKey) {
      throw new Error(`API key required for ${provider.name}`);
    }

    const requestBody = {
      model: this.config.model,
      messages,
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
      stream: false
    };

    try {
      const response = await fetch(provider.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${provider.name} API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';

      return {
        text: content,
        usage: data.usage,
        model: this.config.model,
        provider: this.config.provider
      };
    } catch (error) {
      console.error(`${provider.name} API call failed:`, error);
      throw error;
    }
  }

  getConfig(): AIConfig {
    return { ...this.config };
  }

  getProvider(): AIProvider {
    return this.providers[this.config.provider];
  }

  supportsVoice(): boolean {
    return this.providers[this.config.provider]?.supportsVoice || false;
  }

  isConfigured(): boolean {
    return !!this.config.apiKey;
  }

  getStatus(): string {
    if (!this.isConfigured()) return 'Not Configured';
    return `${this.providers[this.config.provider].name} Active`;
  }
}

export const unifiedAIService = new UnifiedAIService();
