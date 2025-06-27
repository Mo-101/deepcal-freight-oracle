
import { deepTalkGroqService } from '@/services/deepTalkGroqService'
import { generateEnhancedResponse } from './enhancedResponseGenerator'

interface RouteOption {
  id: string
  carrier: string
  route: string
  hub: string
  destination: string
  transitTime: number
  cost: number
  reliability: number
  riskLevel: number
  overallScore: number
}

interface DeepTalkContext {
  intent: string
  params: any
  query: string
  routeDatabase: RouteOption[]
  conversationHistory: any[]
  userPreferences: any
  currentShipment?: any
  setContext: (context: any) => void
}

export async function generateDynamicResponse(context: DeepTalkContext): Promise<string> {
  const { intent, params, query, routeDatabase, conversationHistory, userPreferences, currentShipment, setContext } = context

  // Check if Groq is configured and available
  if (deepTalkGroqService.isConfigured()) {
    try {
      console.log('🧠 DeepCAL thinking with Groq intelligence...')
      
      const groqContext = {
        intent,
        routeDatabase,
        conversationHistory,
        userPreferences,
        currentShipment
      }

      const groqResponse = await deepTalkGroqService.generateResponse(query, groqContext)
      
      // Update context with the recommendation for future reference
      if (intent.includes('optimization') || intent.includes('guidance')) {
        const best = routeDatabase.sort((a, b) => b.overallScore - a.overallScore)[0]
        setContext((prev: any) => ({ ...prev, lastRecommendation: best, groqGenerated: true }))
      }

      console.log('✨ Groq-powered DeepCAL response generated')
      return groqResponse.response

    } catch (error) {
      console.log('🔄 Groq failed, falling back to hardcoded wisdom:', error)
      // Fall back to hardcoded responses
      return generateEnhancedResponse(intent, params, query, routeDatabase, {}, setContext)
    }
  } else {
    console.log('🔮 Using hardcoded DeepCAL wisdom (Groq not configured)')
    // Use hardcoded responses when Groq is not configured
    return generateEnhancedResponse(intent, params, query, routeDatabase, {}, setContext)
  }
}
