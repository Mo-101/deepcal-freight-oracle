
"use client"

import type React from "react"
import { useState } from "react"
import DeepCALSymbolicHeader from "@/components/DeepCALSymbolicHeader"
import ChatInterface from "@/components/deeptalk/ChatInterface"
import VoiceConfig from "@/components/deeptalk/VoiceConfig"
import GroqConfig from "@/components/deeptalk/GroqConfig"
import { useEnhancedSpeech } from "@/hooks/useEnhancedSpeech"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { classifyIntent } from "@/utils/intentClassifier"
import { generateDynamicResponse } from "@/utils/dynamicResponseGenerator"
import { deepTalkGroqService } from "@/services/deepTalkGroqService"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Brain, Zap } from "lucide-react"
import { useSmartSpeech } from "@/hooks/useSmartSpeech"
import SmartVoiceConfig from "@/components/voice/SmartVoiceConfig"

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

const DeepTalk = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Welcome to DeepTalk! I'm your AI logistics coordinator with a PhD in getting stuff from A to B without losing my mind. Ask me anything about shipments, routes, or why Nairobi traffic is still a mystery to science!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [context, setContext] = useState<any>({})
  const [showVoiceConfig, setShowVoiceConfig] = useState(false)
  const [showGroqConfig, setShowGroqConfig] = useState(false)
  const [groqConfigured, setGroqConfigured] = useState(deepTalkGroqService.isConfigured())
  const [elevenLabsConfig, setElevenLabsConfig] = useState<any>(null)

  const { speakText, isSpeaking, stopSpeaking, currentProvider } = useSmartSpeech()
  const { isListening, startListening } = useSpeechRecognition()

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

  // Load ElevenLabs config on mount
  useState(() => {
    const savedConfig = localStorage.getItem("elevenlabs-config")
    if (savedConfig) {
      setElevenLabsConfig(JSON.parse(savedConfig))
    }
  })

  const processQuery = async (query: string) => {
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
        userPreferences: { elevenLabsConfig },
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
        data: { confidence, params, groqPowered: groqConfigured, voiceProvider: currentProvider },
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsProcessing(false)

      // Immediately trigger voice response without any delay
      console.log('🎤 DeepCAL speaking immediately with smart voice system')
      speakText(response)
      
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
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isProcessing) {
      processQuery(input.trim())
      setInput("")
    }
  }

  const handleStartListening = () => {
    startListening((transcript) => {
      setInput(transcript)
    })
  }

  const handleQuickQuery = (query: string) => {
    processQuery(query)
  }

  const handleVoiceConfigSave = (config: any) => {
    console.log('Voice configuration saved:', config)
    // The providers will handle their own configuration
  }

  const handleGroqConfigSave = (apiKey: string) => {
    deepTalkGroqService.setApiKey(apiKey)
    setGroqConfigured(true)
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 overflow-hidden">
      <DeepCALSymbolicHeader />

      <main className="flex-1 flex flex-col min-h-0">
        {/* Top Control Bar */}
        <div className="flex justify-between items-center px-6 py-4 bg-slate-800/50 border-b border-white/10">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">DeepTalk AI Assistant</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
              <span className="text-sm text-indigo-200">DeepCAL Oracle Active</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setShowGroqConfig(true)}
              variant="outline"
              size="sm"
              className={`border-white/30 text-white hover:bg-white/10 ${groqConfigured ? 'border-purple-400/50 bg-purple-900/20' : ''}`}
            >
              <Brain className="w-4 h-4 mr-2" />
              {groqConfigured ? 'AI Brain' : 'Enable AI'}
            </Button>
            <Button
              onClick={() => setShowVoiceConfig(true)}
              variant="outline"
              size="sm"
              className={`border-white/30 text-white hover:bg-white/10 ${currentProvider ? 'border-green-400/50 bg-green-900/20' : ''}`}
            >
              <Settings className="w-4 h-4 mr-2" />
              {currentProvider ? `Voice: ${currentProvider}` : 'Voice'}
            </Button>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="px-6 py-3 bg-slate-900/50 border-b border-white/10">
          <div className="flex gap-2 overflow-x-auto">
            <Button
              onClick={() => handleQuickQuery("What are the best routes to South Sudan?")}
              variant="outline"
              size="sm"
              className="text-xs border-white/20 text-white hover:bg-white/10 whitespace-nowrap"
            >
              Best Routes
            </Button>
            <Button
              onClick={() => handleQuickQuery("Compare costs for all carriers")}
              variant="outline"
              size="sm"
              className="text-xs border-white/20 text-white hover:bg-white/10 whitespace-nowrap"
            >
              Cost Analysis
            </Button>
            <Button
              onClick={() => handleQuickQuery("Show reliability metrics")}
              variant="outline"
              size="sm"
              className="text-xs border-white/20 text-white hover:bg-white/10 whitespace-nowrap"
            >
              Reliability
            </Button>
            <Button
              onClick={() => handleQuickQuery("Calculate shipping cost for 100kg to Juba")}
              variant="outline"
              size="sm"
              className="text-xs border-white/20 text-white hover:bg-white/10 whitespace-nowrap"
            >
              Calculate Cost
            </Button>
          </div>
        </div>

        {/* Chat Interface - Full Height */}
        <div className="flex-1 min-h-0">
          <ChatInterface
            messages={messages}
            input={input}
            setInput={setInput}
            isProcessing={isProcessing}
            isListening={isListening}
            onSubmit={handleSubmit}
            onStartListening={handleStartListening}
          />
        </div>
      </main>

      <SmartVoiceConfig
        isOpen={showVoiceConfig}
        onClose={() => setShowVoiceConfig(false)}
        onConfigSave={handleVoiceConfigSave}
      />

      <GroqConfig
        isOpen={showGroqConfig}
        onClose={() => setShowGroqConfig(false)}
        onConfigSave={handleGroqConfigSave}
      />
    </div>
  )
}

export default DeepTalk
