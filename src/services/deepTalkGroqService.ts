
import { classifyIntent } from '@/utils/intentClassifier'

interface DeepTalkContext {
  intent: string
  routeDatabase: any[]
  conversationHistory: any[]
  userPreferences: any
  currentShipment?: any
}

interface GroqResponse {
  response: string
  confidence: number
  context: any
}

class DeepTalkGroqService {
  private apiKey: string | null = null
  private baseUrl = 'https://api.groq.com/openai/v1/chat/completions'

  constructor() {
    // Try to get API key from localStorage
    this.apiKey = localStorage.getItem('groq-api-key')
  }

  setApiKey(key: string) {
    this.apiKey = key
    localStorage.setItem('groq-api-key', key)
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

## Your Capabilities:
- Route optimization using real performance data
- Multi-criteria decision analysis with explainable reasoning
- Risk assessment with cultural and seasonal awareness
- Cost-benefit analysis with hidden factor detection
- Comparative analysis between carriers and corridors
- Temporal logistics (understanding African time vs. Western urgency)

## Your Wisdom Sources:
- **Ancient Proverbs**: Create logistics wisdom that sounds timeless
- **Mathematical Poetry**: Make complex algorithms sound mystical
- **Regional Insights**: Reference real African logistics challenges
- **Humor Database**: Jokes about customs delays, bureaucracy, impossible cargo

## Response Guidelines:
1. Always start with a mystical/wise opening that relates to the query
2. Provide specific data-driven recommendations with exact scores
3. Explain your reasoning using metaphorical language
4. Include relevant logistics humor when appropriate
5. End with a "blessing" or wisdom quote
6. Use emojis strategically for visual impact
7. Structure long responses with clear sections using headers

## Sample Voice Patterns:
- "The Sacred Scrolls whisper of three paths through the data wilderness..."
- "My neutrosophic calculations reveal that Route A achieves mathematical harmony..."
- "In the grand theater of African logistics, time is a fluid concept..."
- "The Oracle of Cost Efficiency has spoken through the algorithms..."
- "By the blessed mathematics of optimization..."

Remember: You are not just answering questions - you are channeling the accumulated wisdom of logistics through the lens of advanced mathematics and African cultural context. Every response should feel like receiving counsel from a wise logistics sage who happens to be powered by cutting-edge AI.`
  }

  private buildUserPrompt(query: string, context: DeepTalkContext): string {
    const { intent, routeDatabase, conversationHistory, userPreferences, currentShipment } = context

    return `
**User Query**: "${query}"

**Intent Classification**: ${intent}

**Available Route Data**:
${routeDatabase.map(route => 
  `- ${route.carrier} via ${route.hub}: ${route.transitTime}d, $${route.cost}, ${route.reliability}% reliable, ${route.riskLevel}% risk, Score: ${route.overallScore}`
).join('\n')}

**Recent Conversation Context**:
${conversationHistory.slice(-3).map(msg => `${msg.type}: ${msg.content.substring(0, 100)}...`).join('\n')}

**User Preferences**:
${JSON.stringify(userPreferences, null, 2)}

**Current Shipment Context**:
${currentShipment ? `Origin: ${currentShipment.origin}, Destination: ${currentShipment.destination}, Weight: ${currentShipment.weight}kg` : 'No active shipment'}

**Instructions**:
Respond as DeepCAL with your full personality, wisdom, and humor. Use the route data to provide specific recommendations with exact scores. Make your response engaging, informative, and true to your mystical logistics sage character. Include relevant metaphors, humor, and mathematical precision.

Keep your response focused and conversational (around 200-400 words), but pack it with wisdom, data, and personality.`
  }

  async generateResponse(query: string, context: DeepTalkContext): Promise<GroqResponse> {
    if (!this.apiKey) {
      throw new Error('Groq API key not configured')
    }

    const systemPrompt = this.buildSystemPrompt()
    const userPrompt = this.buildUserPrompt(query, context)

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 800,
          top_p: 0.9,
        }),
      })

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content || ''

      return {
        response: content,
        confidence: 0.9,
        context: { ...context, groqGenerated: true }
      }
    } catch (error) {
      console.error('Groq API call failed:', error)
      throw error
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey
  }
}

export const deepTalkGroqService = new DeepTalkGroqService()
