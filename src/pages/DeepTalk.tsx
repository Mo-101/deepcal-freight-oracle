"use client"

import type React from "react"
import { useState } from "react"
import UnifiedGlassHeader from "@/components/UnifiedGlassHeader"
import ChatInterface from "@/components/deeptalk/ChatInterface"
import VoiceConfig from "@/components/deeptalk/VoiceConfig"
import GroqConfig from "@/components/deeptalk/GroqConfig"
import { useEnhancedSpeech } from "@/hooks/useEnhancedSpeech"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { classifyIntent } from "@/utils/intentClassifier"
import { generateDynamicResponse } from "@/utils/dynamicResponseGenerator"
import { deepTalkGroqService } from "@/services/deepTalkGroqService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Brain, TrendingUp, Zap, Activity } from "lucide-react"

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
        data: { confidence, params, groqPowered: groqConfigured },
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsProcessing(false)

      // Only use voice synthesis if ElevenLabs is properly configured
      if (elevenLabsConfig && elevenLabsConfig.apiKey) {
        console.log('🎤 DeepCAL speaking with ElevenLabs voice synthesis')
        speakText(response, elevenLabsConfig)
      } else {
        console.log('Voice synthesis requires ElevenLabs API key configuration')
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
    setElevenLabsConfig(config)
  }

  const handleGroqConfigSave = (apiKey: string) => {
    deepTalkGroqService.setApiKey(apiKey)
    setGroqConfigured(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <UnifiedGlassHeader />
      
      <main className="flex-1 flex flex-col px-6 py-4 min-h-0">
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h1 className="text-2xl font-bold text-white">DeepTalk AI</h1>
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
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Settings className="w-4 h-4 mr-2" />
              Voice
            </Button>
          </div>
        </div>

        {/* Main Chat Container */}
        <div className="flex-1 min-h-0 mb-4">
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

        {/* Live Stats Cards - Fixed height at bottom */}
        <div className="flex-shrink-0 h-40">
          <div className="grid grid-cols-3 gap-4 h-full">
            {/* Quick Actions Card */}
            <Card className="glass-card border border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-lime-400 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => handleQuickQuery("What are the best routes to South Sudan?")}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs border-white/20 text-white hover:bg-white/10 h-8"
                >
                  Best Routes
                </Button>
                <Button
                  onClick={() => handleQuickQuery("Compare costs for all carriers")}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs border-white/20 text-white hover:bg-white/10 h-8"
                >
                  Cost Analysis
                </Button>
                <Button
                  onClick={() => handleQuickQuery("Show reliability metrics")}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs border-white/20 text-white hover:bg-white/10 h-8"
                >
                  Reliability
                </Button>
              </CardContent>
            </Card>

            {/* Route Performance Card */}
            <Card className="glass-card border border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-lime-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Top Routes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {routeDatabase.slice(0, 3).map((route) => (
                  <div key={route.id} className="flex justify-between items-center text-xs">
                    <span className="text-white truncate mr-2">{route.route}</span>
                    <Badge className="text-xs bg-lime-400/20 text-lime-300 border-lime-400/30">
                      {(route.overallScore * 100).toFixed(0)}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Status Card */}
            <Card className="glass-card border border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-lime-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-indigo-300">AI Brain</span>
                  <Badge className={groqConfigured ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}>
                    {groqConfigured ? "Active" : "Offline"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-indigo-300">Voice</span>
                  <Badge className={elevenLabsConfig ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300"}>
                    {elevenLabsConfig ? "Ready" : "Config"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-indigo-300">Routes</span>
                  <Badge className="bg-blue-900 text-blue-300">
                    {routeDatabase.length} Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <VoiceConfig
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
