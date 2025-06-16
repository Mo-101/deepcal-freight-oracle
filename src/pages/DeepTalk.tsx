"use client"

import type React from "react"
import { useState } from "react"
import DeepCALHeader from "@/components/DeepCALHeader"
import ChatInterface from "@/components/deeptalk/ChatInterface"
import SidePanel from "@/components/deeptalk/SidePanel"
import VoiceConfig from "@/components/deeptalk/VoiceConfig"
import { useEnhancedSpeech } from "@/hooks/useEnhancedSpeech"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { classifyIntent } from "@/utils/intentClassifier"
import { generateEnhancedResponse } from "@/utils/enhancedResponseGenerator"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

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
  const [elevenLabsConfig, setElevenLabsConfig] = useState<any>(null)

  const { speakText, isSpeaking, stopSpeaking } = useEnhancedSpeech()
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

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Classify intent and generate enhanced response
    const { intent, confidence, params } = classifyIntent(query)
    const response = generateEnhancedResponse(intent, params, query, routeDatabase, context, setContext)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: response,
      timestamp: new Date(),
      intent,
      data: { confidence, params },
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsProcessing(false)

    // Enhanced speech with ElevenLabs or fallback
    console.log("DeepCAL speaking with enhanced voice system")
    speakText(response, elevenLabsConfig)
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
    setElevenLabsConfig(config)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900" style={{
      fontFamily: "'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'"
    }}>
      <DeepCALHeader />

      <main className="flex-1 container mx-auto py-8 px-2 sm:px-6 flex flex-col lg:flex-row gap-6">
        <div className="flex justify-between items-center w-full lg:hidden mb-4">
          <h1 className="text-2xl font-bold text-white">DeepTalk AI</h1>
          <Button
            onClick={() => setShowVoiceConfig(true)}
            variant="outline"
            size="sm"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Settings className="w-4 h-4 mr-2" />
            Voice Settings
          </Button>
        </div>

        <ChatInterface
          messages={messages}
          input={input}
          setInput={setInput}
          isProcessing={isProcessing}
          isListening={isListening}
          onSubmit={handleSubmit}
          onStartListening={handleStartListening}
        />

        <div className="space-y-4">
          <div className="hidden lg:flex justify-end">
            <Button
              onClick={() => setShowVoiceConfig(true)}
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Settings className="w-4 h-4 mr-2" />
              Voice Settings
            </Button>
          </div>
          
          <SidePanel
            routeDatabase={routeDatabase}
            isProcessing={isProcessing}
            onQuickQuery={handleQuickQuery}
          />
        </div>
      </main>

      <VoiceConfig
        isOpen={showVoiceConfig}
        onClose={() => setShowVoiceConfig(false)}
        onConfigSave={handleVoiceConfigSave}
      />

      <style>
        {`
        .oracle-card {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%);
        }
        `}
      </style>
    </div>
  )
}

export default DeepTalk
