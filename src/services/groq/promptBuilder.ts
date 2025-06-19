
import type { GroqContext } from '@/types/groq';

/**
 * Handles system prompt generation and context building for Groq AI
 */
export class GroqPromptBuilder {
  /**
   * Gets the default system prompt for DeepCAL AI
   */
  static getDefaultSystemPrompt(): string {
    return 'You are DeepCAL AI, an advanced logistics and freight optimization assistant. You specialize in supply chain intelligence, route optimization, and freight analytics. Provide intelligent, data-driven responses about logistics, shipping, and supply chain optimization. Be conversational but authoritative.';
  }

  /**
   * Builds a context-aware system prompt based on available data
   */
  static buildContextualSystemPrompt(context: GroqContext): string {
    const { intent, routeDatabase, userPreferences } = context;
    
    let prompt = this.getDefaultSystemPrompt();
    
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
}
