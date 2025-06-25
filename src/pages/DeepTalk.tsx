"use client"

import type React from "react"
import { useState, useEffect } from "react"
import DeepCALHeader from "@/components/DeepCALHeader"
import ChatInterface from "@/components/deeptalk/ChatInterface"
import SidePanel from "@/components/deeptalk/SidePanel"
import VoiceConfig from "@/components/deeptalk/VoiceConfig"
import GroqConfig from "@/components/deeptalk/GroqConfig"
import { useEnhancedSpeech } from "@/hooks/useEnhancedSpeech"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { classifyIntent } from "@/utils/intentClassifier"
import { generateDynamicResponse } from "@/utils/dynamicResponseGenerator"
import { deepTalkGroqService } from "@/services/deepTalkGroqService"
import { Button } from "@/components/ui/button"
import { Settings, Brain } from "lucide-react"
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

  // Load ElevenLabs config on component mount
  useEffect(() => {
    // Ensure page starts at top
    window.scrollTo(0, 0)
    
    const loadVoiceConfig = () => {
      const savedConfig = localStorage.getItem("elevenlabs-config")
      if (savedConfig) {
        try {
          const config = JSON.parse(savedConfig)
          setElevenLabsConfig(config)
          console.log('🎤 Loaded ElevenLabs config:', { hasApiKey: !!config.apiKey, voiceId: config.voiceId })
        } catch (error) {
          console.error('Error loading voice config:', error)
        }
      } else {
        console.log('🔕 No ElevenLabs config found - voice will use browser synthesis')
      }
    }
    
    loadVoiceConfig()
  }, [])

  // Prevent page jumping when new messages are added
  useEffect(() => {
    // Don't auto-scroll when assistant messages are added
    const handleScroll = () => {
      // Keep page at current position when new content appears
      return false
    }
    
    window.addEventListener('scroll', handleScroll, { passive: false })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

      // ENHANCED VOICE SYNTHESIS - Always try to speak the response
      console.log('🎯 DeepCAL preparing to speak...', { 
        hasElevenLabsConfig: !!elevenLabsConfig,
        hasApiKey: !!(elevenLabsConfig?.apiKey),
        responseLength: response.length 
      })
      
      try {
        if (elevenLabsConfig?.apiKey) {
          console.log('🎙️ Using ElevenLabs voice synthesis')
          await speakText(response, elevenLabsConfig)
          
          toast({
            title: "🎤 DeepCAL Speaking",
            description: `Using ${elevenLabsConfig.voiceId === 'onwK4e9ZLuTAKqWW03F9' ? 'Daniel' : 'ElevenLabs'} voice`,
            duration: 2000,
          })
        } else {
          console.log('🔊 Using browser speech synthesis (no API key)')
          await speakText(response)
          
          toast({
            title: "🔊 DeepCAL Speaking",
            description: "Using browser voice synthesis",
            duration: 2000,
          })
        }
      } catch (voiceError) {
        console.error('Voice synthesis failed:', voiceError)
        
        // Force fallback to browser speech
        try {
          await speakText(response)
          toast({
            title: "🔊 Voice Fallback Active",
            description: "Using browser synthesis due to API issue",
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
    console.log('🎤 Voice config updated:', { hasApiKey: !!config.apiKey, voiceId: config.voiceId })
    
    toast({
      title: "🎤 Voice Configuration Saved",
      description: `DeepCAL will now speak with ${config.voiceId === 'onwK4e9ZLuTAKqWW03F9' ? 'Daniel voice' : 'custom voice'}`,
      duration: 3000,
    })
  }

  const handleGroqConfigSave = (apiKey: string) => {
    deepTalkGroqService.setApiKey(apiKey)
    setGroqConfigured(true)
    
    toast({
      title: "🧠 AI Brain Activated",
      description: "DeepCAL intelligence enhanced with Groq",
      duration: 3000,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900" style={{
      fontFamily: "'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'",
      overflow: 'auto' // Ensure proper scrolling behavior
    }}>
      <DeepCALHeader />

      <main className="flex-1 container mx-auto py-8 px-2 sm:px-6 flex flex-col lg:flex-row gap-6">
        <div className="flex justify-between items-center w-full lg:hidden mb-4">
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
          <div className="hidden lg:flex justify-end gap-2">
            <Button
              onClick={() => setShowGroqConfig(true)}
              variant="outline"
              size="sm"
              className={`border-white/30 text-white hover:bg-white/10 ${groqConfigured ? 'border-purple-400/50 bg-purple-900/20' : ''}`}
            >
              <Brain className="w-4 h-4 mr-2" />
              {groqConfigured ? 'AI Brain Active' : 'Enable AI Brain'}
            </Button>
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

      <GroqConfig
        isOpen={showGroqConfig}
        onClose={() => setShowGroqConfig(false)}
        onConfigSave={handleGroqConfigSave}
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
