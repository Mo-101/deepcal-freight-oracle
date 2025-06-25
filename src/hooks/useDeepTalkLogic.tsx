
import { useState, useEffect } from "react"
import { classifyIntent } from "@/utils/intentClassifier"
import { generateDynamicResponse } from "@/utils/dynamicResponseGenerator"
import { useEnhancedSpeech } from "@/hooks/useEnhancedSpeech"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { getTrainingBufferStatus } from "@/services/aiTrainingBridge"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  intent?: string
  data?: any
}

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

export function useDeepTalkLogic() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "🧠 DeepCAL AI Brain activated! I'm your enhanced logistics oracle with full Groq intelligence and live training integration. Ask me anything about shipments, routes, or the mysteries of African logistics!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [context, setContext] = useState<any>({})
  const [trainingBufferStatus, setTrainingBufferStatus] = useState({ count: 0, maxSize: 10 })

  const { speakText, isSpeaking, stopSpeaking } = useEnhancedSpeech()
  const { isListening, startListening } = useSpeechRecognition()
  const { toast } = useToast()

  // Sample data for the analytics engine
  const routeDatabase: RouteOption[] = [
    {
      id: "r1",
      carrier: "DHL Express",
      route: "Nairobi → Juba",
      hub: "Nairobi",
      destination: "South Sudan",
      transitTime: 6,
      cost: 2500,
      reliability: 90,
      riskLevel: 5,
      overallScore: 0.85,
    },
    {
      id: "r2",
      carrier: "FedEx",
      route: "Dakar → Juba",
      hub: "Dakar",
      destination: "South Sudan",
      transitTime: 9,
      cost: 2200,
      reliability: 85,
      riskLevel: 15,
      overallScore: 0.72,
    },
    {
      id: "r3",
      carrier: "Local Carrier",
      route: "Kampala → Juba",
      hub: "Kampala",
      destination: "South Sudan",
      transitTime: 8,
      cost: 1800,
      reliability: 75,
      riskLevel: 20,
      overallScore: 0.68,
    },
  ]

  useEffect(() => {
    // Update training buffer status periodically
    const updateTrainingStatus = () => {
      setTrainingBufferStatus(getTrainingBufferStatus())
    }
    updateTrainingStatus()
    const statusInterval = setInterval(updateTrainingStatus, 5000)
    
    return () => clearInterval(statusInterval)
  }, [])

  // Prevent page jumping when new messages are added
  useEffect(() => {
    const handleScroll = () => {
      return false
    }
    
    window.addEventListener('scroll', handleScroll, { passive: false })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const processQuery = async (query: string, voiceConfig: any) => {
    setIsProcessing(true)
    if (isSpeaking) stopSpeaking()

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: query,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate processing delay for dramatic effect
    await new Promise((resolve) => setTimeout(resolve, 1200))

    try {
      // Classify intent and generate dynamic response with Groq
      const { intent, confidence, params } = classifyIntent(query)
      
      const dynamicContext = {
        intent,
        params,
        query,
        routeDatabase,
        conversationHistory: messages,
        userPreferences: { voiceConfig },
        currentShipment: null,
        setContext
      }

      const response = await generateDynamicResponse(dynamicContext)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
        intent,
        data: { confidence, params, groqPowered: true, trainingIntegrated: true },
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsProcessing(false)

      // ENHANCED VOICE SYNTHESIS with provider support
      console.log('🎯 DeepCAL preparing to speak...', { 
        provider: voiceConfig?.provider,
        hasConfig: !!voiceConfig,
        responseLength: response.length 
      })
      
      try {
        if (voiceConfig) {
          console.log(`🎙️ Using ${voiceConfig.provider} voice synthesis`)
          await speakText(response, voiceConfig)
          
          const providerName = voiceConfig.provider === 'elevenlabs' ? 
            (voiceConfig.voiceId === 'onwK4e9ZLuTAKqWW03F9' ? 'Daniel' : 'ElevenLabs') :
            voiceConfig.model?.toUpperCase() || 'Local'
          
          toast({
            title: `🎤 DeepCAL Speaking`,
            description: `Using ${providerName} voice`,
            duration: 2000,
          })
        } else {
          console.log('🔊 Using browser speech synthesis (no config)')
          await speakText(response)
          
          toast({
            title: "🔊 DeepCAL Speaking",
            description: "Using browser voice synthesis",
            duration: 2000,
          })
        }
      } catch (voiceError) {
        console.error('Voice synthesis failed:', voiceError)
        
        try {
          await speakText(response)
          toast({
            title: "🔊 Voice Fallback Active",
            description: "Using browser synthesis due to provider issue",
            duration: 3000,
          })
        } catch (fallbackError) {
          console.error('Even browser speech failed:', fallbackError)
          toast({
            title: "⚠️ Voice Unavailable", 
            description: "Speech synthesis temporarily unavailable",
            duration: 3000,
            variant: "destructive"
          })
        }
      }
      
    } catch (error) {
      console.error('Error processing query:', error)
      setIsProcessing(false)
      
      // Error fallback message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "🔥 The Oracle experiences temporary interference... The data spirits are restless. Please try again in a moment.",
        timestamp: new Date(),
        intent: "error",
      }
      setMessages((prev) => [...prev, errorMessage])
      
      // Try to speak the error message too
      try {
        await speakText(errorMessage.content)
      } catch (voiceError) {
        console.error('Could not speak error message:', voiceError)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent, voiceConfig: any) => {
    e.preventDefault()
    if (input.trim() && !isProcessing) {
      processQuery(input.trim(), voiceConfig)
      setInput("")
    }
  }

  const handleStartListening = () => {
    startListening((transcript) => {
      setInput(transcript)
    })
  }

  const handleQuickQuery = (query: string, voiceConfig: any) => {
    processQuery(query, voiceConfig)
  }

  return {
    messages,
    input,
    setInput,
    isProcessing,
    isListening,
    routeDatabase,
    trainingBufferStatus,
    handleSubmit,
    handleStartListening,
    handleQuickQuery
  }
}
