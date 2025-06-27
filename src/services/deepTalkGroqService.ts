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

const GROQ_API_KEY = "gsk_4xJQZ9K3vB8pR2mN7LfY6sT1cX0wV9eH4rU5iA2qS8dG7kP3mL6jF9nW2bC8vE5x"

class DeepTalkGroqService {
  private apiKey: string
  private baseUrl = 'https://api.groq.com/openai/v1/chat/completions'
  private isInitialized = true

  constructor() {
    this.apiKey = GROQ_API_KEY
    console.log('🧠 AI Brain auto-activated with Groq intelligence')
  }

  private buildSystemPrompt(): string {
    return `You are DeepCAL, the mystical Oracle of African logistics...` // Omitted for brevity
  }

  private buildUserPrompt(query: string, context: DeepTalkContext): string {
    const { intent, routeDatabase, conversationHistory, userPreferences, currentShipment } = context

    return `
**User Query**: "${query}"

**Intent Classification**: ${intent}

**Available Route Data**:
${routeDatabase.map(route => `- ${route.carrier} via ${route.hub}: ${route.transitTime}d, $${route.cost}, ${route.reliability}% reliable, ${route.riskLevel}% risk, Score: ${route.overallScore}`).join('\n')}

**Recent Conversation Context**:
${conversationHistory.slice(-3).map(msg => `${msg.type}: ${msg.content.substring(0, 100)}...`).join('\n')}

**User Preferences**:
${JSON.stringify(userPreferences, null, 2)}

**Current Shipment Context**:
${currentShipment ? `Origin: ${currentShipment.origin}, Destination: ${currentShipment.destination}, Weight: ${currentShipment.weight}kg` : 'No active shipment'}

**Instructions**:
Respond as DeepCAL with your full personality, wisdom, and humor...` // Omitted for brevity
  }

  async generateResponse(query: string, context: DeepTalkContext): Promise<GroqResponse> {
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

      if (!response.ok) throw new Error(`Groq API error: ${response.status}`)
      const data = await response.json()
      const content = data.choices[0]?.message?.content || ''

      try {
        const { logConversationToTraining } = await import('./aiTrainingBridge')
        await logConversationToTraining(query, content, context)
        console.log('📊 Conversation logged to training system')
      } catch (trainingError) {
        console.warn('Training bridge unavailable:', trainingError)
      }

      return {
        response: content,
        confidence: 0.9,
        context: { ...context, groqGenerated: true, trainingLogged: true }
      }
    } catch (error) {
      console.error('Groq API call failed:', error)
      throw error
    }
  }

  isConfigured(): boolean {
    return this.isInitialized
  }

  getStatus(): string {
    return this.isInitialized ? 'AI Brain Active' : 'Disconnected'
  }
}

export const deepTalkGroqService = new DeepTalkGroqService()
