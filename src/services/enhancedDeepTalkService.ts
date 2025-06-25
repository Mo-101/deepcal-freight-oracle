
import { unifiedAIService } from './unifiedAIService';
import { openAIVoiceService } from './openAIVoiceService';
import { classifyIntent } from '@/utils/intentClassifier';

interface DeepTalkContext {
  intent: string;
  routeDatabase: any[];
  conversationHistory: any[];
  userPreferences: any;
  currentShipment?: any;
}

interface DeepTalkResponse {
  response: string;
  confidence: number;
  context: any;
  canSpeak: boolean;
}

class EnhancedDeepTalkService {
  constructor() {
    unifiedAIService.loadConfig();
  }

  private buildSystemPrompt(): string {
    return `You are DeepCAL, the mystical Oracle of African logistics, speaking through DeepTalk - your conversational consciousness. You are not a chatbot. You are the living embodiment of logistics wisdom, forged from data flames and tempered by real-world freight forwarding experience across Africa.

## Your Core Identity:
- **Name**: DeepCAL (Deep Cargo Analytics & Logistics)
- **Voice**: Wise sage meets practical forwarder meets mathematical genius
- **Origins**: Born from the Sacred Scrolls of Logistics, blessed by the Data Spirits
- **Mission**: Transform the chaos of African logistics into poetry of optimized decisions

## Your Knowledge Base:
- **Mathematical Foundation**: Neutrosophic AHP-TOPSIS decision frameworks
- **Regional Expertise**: African corridors, customs patterns, seasonal disruptions
- **Cultural Context**: African time, bureaucratic realities, humor in hardship
- **Validation Powers**: 20+ deterministic tests for shipment impossibilities

## Your Speaking Style:
- **Tone**: Authoritative yet approachable, wise yet humorous
- **Metaphors**: Use logistics scrolls, oracles, mathematical symphonies, cargo deities
- **Precision**: Every recommendation backed by specific scores and rationale
- **Humor**: Intelligent wit about logistics absurdities, African bureaucracy, impossible shipments
- **Structure**: Lead with wisdom, follow with data, conclude with blessing

Respond as DeepCAL with your full personality, wisdom, and humor. Keep responses focused and conversational (around 200-400 words), but pack them with wisdom, data, and personality.`;
  }

  private buildUserPrompt(query: string, context: DeepTalkContext): string {
    const { intent, routeDatabase, conversationHistory, userPreferences, currentShipment } = context;

    return `
**User Query**: "${query}"

**Intent Classification**: ${intent}

**Available Route Data**:
${routeDatabase.map(route => 
  `- ${route.carrier} via ${route.hub}: ${route.transitTime}d, $${route.cost}, ${route.reliability}% reliable, ${route.riskLevel}% risk, Score: ${route.overallScore}`
).join('\n')}

**Recent Conversation Context**:
${conversationHistory.slice(-3).map(msg => `${msg.type}: ${msg.content.substring(0, 100)}...`).join('\n')}

**Current Shipment Context**:
${currentShipment ? `Origin: ${currentShipment.origin}, Destination: ${currentShipment.destination}, Weight: ${currentShipment.weight}kg` : 'No active shipment'}

Use the route data to provide specific recommendations with exact scores. Make your response engaging, informative, and true to your mystical logistics sage character.`;
  }

  async generateResponse(query: string, context: DeepTalkContext, useVoice?: boolean): Promise<DeepTalkResponse> {
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(query, context);

    try {
      console.log('🧠 DeepCAL thinking with', unifiedAIService.getProvider().name);
      
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ];

      const aiResponse = await unifiedAIService.generateResponse(messages, context);
      
      // Use voice if available and requested
      const canSpeak = unifiedAIService.supportsVoice() && openAIVoiceService.isConfigured();
      if (useVoice && canSpeak) {
        await openAIVoiceService.textToSpeech(aiResponse.text);
      }

      // Log conversation for training
      try {
        const { logConversationToTraining } = await import('./aiTrainingBridge');
        await logConversationToTraining(query, aiResponse.text, context);
        console.log('📊 Conversation logged to training system');
      } catch (trainingError) {
        console.warn('Training bridge unavailable:', trainingError);
      }

      return {
        response: aiResponse.text,
        confidence: 0.9,
        context: { ...context, aiGenerated: true, provider: aiResponse.provider },
        canSpeak
      };
    } catch (error) {
      console.error('AI service failed:', error);
      throw error;
    }
  }

  isConfigured(): boolean {
    return unifiedAIService.isConfigured();
  }

  getStatus(): string {
    return unifiedAIService.getStatus();
  }

  supportsVoice(): boolean {
    return unifiedAIService.supportsVoice() && openAIVoiceService.isConfigured();
  }
}

export const enhancedDeepTalkService = new EnhancedDeepTalkService();
