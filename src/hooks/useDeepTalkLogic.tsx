
import { useState, useEffect } from "react"
import { classifyIntent } from "@/utils/intentClassifier"
import { generateDynamicResponse } from "@/utils/dynamicResponseGenerator"
import { useEnhancedSpeech } from "@/hooks/useEnhancedSpeech"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { getTrainingBufferStatus } from "@/services/aiTrainingBridge"
import { useToast } from "@/hooks/use-toast"
import { deepcalVoiceService } from "@/services/deepcalVoiceService"

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
      content: "🧠 DeepCAL Neural Mind activated. I am the first symbolic logistics intelligence, forged for African trade corridors. Speak, and I shall analyze with mathematical precision.",
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

  // Voice the initial message
  useEffect(() => {
    if (messages.length === 1) {
      setTimeout(() => {
        deepcalVoiceService.speakPresentation("Neural interface");
      }, 1000);
    }
  }, []);

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

    // Simulate neural processing delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      // Classify intent and generate dynamic response
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
        data: { confidence, params, neuralPowered: true, symbolicReasoning: true },
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsProcessing(false)

      // Use DeepCAL's neural voice
      console.log('🧠 DeepCAL Neural Mind preparing response...', { 
        intent,
        confidence,
        responseLength: response.length 
      })
      
      try {
        // Use the enhanced DeepCAL voice service
        await deepcalVoiceService.speakCustom(response);
        
        // Subtle toast for voice confirmation (not intrusive)
        toast({
          title: "🧠 Neural Voice Active",
          description: "DeepCAL speaking with symbolic intelligence",
          duration: 2000,
        })
      } catch (voiceError) {
        console.error('Neural voice synthesis failed:', voiceError)
        
        try {
          await speakText(response)
          toast({
            title: "🔊 Voice Fallback",
            description: "Using backup synthesis",
            duration: 2000,
          })
        } catch (fallbackError) {
          console.error('All voice synthesis failed:', fallbackError)
        }
      }
      
    } catch (error) {
      console.error('Neural processing error:', error)
      setIsProcessing(false)
      
      // Error response with neural personality
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "🔥 Neural interference detected. Symbolic pathways temporarily disrupted. Recalibrating quantum logistics matrix...",
        timestamp: new Date(),
        intent: "error",
      }
      setMessages((prev) => [...prev, errorMessage])
      
      // Speak error with neural voice
      try {
        await deepcalVoiceService.speakCustom("Neural interference detected. Recalibrating systems.");
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
