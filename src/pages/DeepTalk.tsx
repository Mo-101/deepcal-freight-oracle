
"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DeepCALHeader from "@/components/DeepCALHeader"
import {
  Mic,
  Send,
  Bot,
  User,
  Truck,
  BarChart3,
  MapPin,
  Clock,
  DollarSign,
  Shield,
  Zap,
  MessageSquare,
} from "lucide-react"

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
        "🚚 Welcome to DeepTalk! I'm your AI logistics coordinator with a PhD in getting stuff from A to B without losing my mind. Ask me anything about shipments, routes, or why Nairobi traffic is still a mystery to science!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [context, setContext] = useState<any>({})

  const synthRef = useRef<SpeechSynthesis | null>(null)
  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis

      // Initialize speech recognition
      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInput(transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = () => setIsListening(false)
        recognitionRef.current.onend = () => setIsListening(false)
      }
    }

    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const speakText = (text: string) => {
    if (!synthRef.current) return

    synthRef.current.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.1
    utterance.pitch = 0.8 // Lower pitch for male voice
    utterance.volume = 0.9

    const voices = synthRef.current.getVoices()
    // Prefer male voices
    const preferredVoice =
      voices.find((voice) => voice.lang.includes("en") && (voice.name.toLowerCase().includes("male") || voice.name.toLowerCase().includes("david") || voice.name.toLowerCase().includes("daniel"))) ||
      voices.find((voice) => voice.lang.includes("en") && voice.name.includes("Google")) ||
      voices.find((voice) => voice.lang.includes("en")) ||
      voices[0]

    if (preferredVoice) utterance.voice = preferredVoice
    synthRef.current.speak(utterance)
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const classifyIntent = (query: string): { intent: string; confidence: number; params: any } => {
    const lowerQuery = query.toLowerCase()

    // Optimization queries
    if (lowerQuery.includes("fastest") || lowerQuery.includes("quickest") || lowerQuery.includes("speed")) {
      return { intent: "optimization_time", confidence: 0.9, params: { priority: "speed" } }
    }
    if (lowerQuery.includes("cheapest") || lowerQuery.includes("lowest cost") || lowerQuery.includes("budget")) {
      return { intent: "optimization_cost", confidence: 0.9, params: { priority: "cost" } }
    }

    // Comparison queries
    if (lowerQuery.includes("compare") || lowerQuery.includes("vs") || lowerQuery.includes("versus")) {
      return { intent: "comparison", confidence: 0.85, params: { type: "route_comparison" } }
    }

    // Metric queries
    if (lowerQuery.includes("how long") || lowerQuery.includes("transit time") || lowerQuery.includes("duration")) {
      return { intent: "metrics_time", confidence: 0.8, params: { metric: "transit_time" } }
    }
    if (lowerQuery.includes("risk") || lowerQuery.includes("disruption") || lowerQuery.includes("reliable")) {
      return { intent: "metrics_risk", confidence: 0.8, params: { metric: "risk_assessment" } }
    }

    // Explanation queries
    if (lowerQuery.includes("why") || lowerQuery.includes("explain") || lowerQuery.includes("reason")) {
      return { intent: "explanation", confidence: 0.85, params: { type: "decision_rationale" } }
    }

    // General guidance
    if (lowerQuery.includes("suggest") || lowerQuery.includes("recommend") || lowerQuery.includes("best way")) {
      return { intent: "guidance", confidence: 0.8, params: { type: "general_recommendation" } }
    }

    return { intent: "general", confidence: 0.6, params: {} }
  }

  const generateResponse = (intent: string, params: any, query: string): string => {
    const responses = {
      optimization_time: () => {
        const fastest = routeDatabase.sort((a, b) => a.transitTime - b.transitTime)[0]
        return `🚀 For maximum speed, I'd go with ${fastest.carrier} via ${fastest.hub}! It'll get there in just ${fastest.transitTime} days with ${fastest.reliability}% reliability. Sure, it costs $${fastest.cost}, but time is money, and this route moves faster than gossip in a small town! The alternative via Dakar takes ${routeDatabase[1].transitTime} days - that's ${routeDatabase[1].transitTime - fastest.transitTime} extra days of your cargo playing tourist.`
      },

      optimization_cost: () => {
        const cheapest = routeDatabase.sort((a, b) => a.cost - b.cost)[0]
        return `💰 Budget-conscious, I see! ${cheapest.carrier} via ${cheapest.hub} is your wallet's best friend at just $${cheapest.cost}. Yes, it takes ${cheapest.transitTime} days (not the fastest), but you'll save $${routeDatabase[0].cost - cheapest.cost} compared to the speed demon option. That's enough savings to buy everyone on your team lunch... for a month! Reliability sits at ${cheapest.reliability}%, which isn't bad for the price.`
      },

      comparison: () => {
        const nairobi = routeDatabase.find((r) => r.hub === "Nairobi")!
        const dakar = routeDatabase.find((r) => r.hub === "Dakar")!
        return `🥊 Nairobi vs Dakar showdown! Here's the tea: Nairobi wins on speed (${nairobi.transitTime} vs ${dakar.transitTime} days) and reliability (${nairobi.reliability}% vs ${dakar.reliability}%). But Dakar fights back on cost ($${dakar.cost} vs $${nairobi.cost}). Risk-wise, Nairobi is safer (${nairobi.riskLevel}% vs ${dakar.riskLevel}% disruption risk). Overall score: Nairobi ${nairobi.overallScore} vs Dakar ${dakar.overallScore}. Nairobi takes the crown! 👑`
      },

      metrics_time: () => {
        const avgTime = routeDatabase.reduce((sum, r) => sum + r.transitTime, 0) / routeDatabase.length
        return `⏰ Transit time intel coming right up! For your typical shipment, expect ${Math.round(avgTime)} days on average. The speed range goes from ${Math.min(...routeDatabase.map((r) => r.transitTime))} days (if you're in a hurry and have deep pockets) to ${Math.max(...routeDatabase.map((r) => r.transitTime))} days (if you're more patient than a saint). Current conditions are pretty stable - no major delays reported!`
      },

      metrics_risk: () => {
        const avgRisk = routeDatabase.reduce((sum, r) => sum + r.riskLevel, 0) / routeDatabase.length
        return `🛡️ Risk assessment time! Current disruption risk averages ${Math.round(avgRisk)}% across major routes. Nairobi route is looking solid at ${routeDatabase[0].riskLevel}% risk (basically bulletproof), while some alternatives run higher. Weather's been cooperative, no major port strikes, and customs are moving smoother than usual. It's a good time to ship!`
      },

      explanation: () => {
        if (context.lastRecommendation) {
          const rec = context.lastRecommendation
          return `🤔 Great question! I recommended ${rec.carrier} because it scored highest (${rec.overallScore}) on our multi-criteria analysis. Here's the breakdown: Speed factor (${rec.transitTime} days), Cost efficiency ($${rec.cost}), Reliability (${rec.reliability}%), and Risk level (${rec.riskLevel}%). The algorithm weighs these using neutrosophic AHP - fancy math that basically means "let's be smart about trade-offs." It wasn't just the fastest or cheapest, but the best overall balance!`
        }
        return `🎯 I use a sophisticated decision engine that considers multiple factors: transit time, cost, reliability, and risk. Each gets weighted based on typical logistics priorities, then I calculate an overall score. It's like having a logistics expert's brain, but without the coffee addiction and with better math skills!`
      },

      guidance: () => {
        const best = routeDatabase.sort((a, b) => b.overallScore - a.overallScore)[0]
        setContext({ ...context, lastRecommendation: best })
        return `🎯 For your shipment, I'm recommending ${best.carrier} via ${best.hub}! Here's why it's brilliant: ${best.transitTime} days transit (not the absolute fastest, but respectable), $${best.cost} cost (reasonable for the service level), and ${best.reliability}% reliability (your cargo won't go on an unplanned adventure). Overall score: ${best.overallScore} - that's what we call the sweet spot! Want me to explain the alternatives or dive deeper into any aspect?`
      },

      general: () => {
        const funnyResponses = [
          "🤖 I'm here to help with all your logistics needs! Ask me about routes, costs, timing, or why shipping containers sometimes seem to have a mind of their own!",
          "📦 Ready to solve your shipping puzzles! I can compare routes, optimize for speed or cost, assess risks, or just chat about the fascinating world of global logistics!",
          "🌍 Your friendly neighborhood logistics AI at your service! Whether you need route recommendations, cost analysis, or just want to know why 'express shipping' sometimes feels like 'express waiting'!",
        ]
        return funnyResponses[Math.floor(Math.random() * funnyResponses.length)]
      },
    }

    return responses[intent as keyof typeof responses]?.() || responses.general()
  }

  const processQuery = async (query: string) => {
    setIsProcessing(true)

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

    // Classify intent and generate response
    const { intent, confidence, params } = classifyIntent(query)
    const response = generateResponse(intent, params, query)

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

    // Speak the response with male voice
    speakText(response.replace(/[🚚🚀💰🥊⏰🛡️🤔🎯📦🌍🤖]/gu, ""))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isProcessing) {
      processQuery(input.trim())
      setInput("")
    }
  }

  const quickQueries = [
    "What's the fastest way to ship to South Sudan?",
    "Compare Nairobi vs Dakar routes",
    "How much does it cost to ship 5 tons?",
    "What's the risk level for Mombasa port?",
    "Suggest the best route for urgent medical supplies",
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900" style={{
      fontFamily: "'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'"
    }}>
      {/* Top nav - unified */}
      <DeepCALHeader />

      {/* Main area */}
      <main className="flex-1 container mx-auto py-8 px-2 sm:px-6 flex flex-col lg:flex-row gap-6">
        {/* Chat Interface */}
        <div className="flex-1 lg:max-w-3xl">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-md overflow-hidden flex flex-col oracle-card border border-white/20 h-[600px]">
            {/* Chat Title */}
            <div className="bg-slate-800/50 px-6 py-4 border-b border-white/20 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <MessageSquare className="text-blue-400" />
                DeepTalk AI Conversation
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-indigo-200">AI is online</span>
                <div className="w-2 h-2 bg-lime-400 rounded-full" />
              </div>
            </div>

            {/* Chat Conversation */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col" id="chatContainer">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === "user" ? "bg-blue-600" : "bg-lime-400"
                        }`}
                      >
                        {message.type === "user" ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-slate-900" />
                        )}
                      </div>

                      <div
                        className={`rounded-lg p-3 ${
                          message.type === "user" 
                            ? "bg-blue-600 text-white" 
                            : "bg-slate-800/80 text-white border border-white/20 backdrop-filter backdrop-blur-8px"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.intent && (
                          <Badge className="mt-2 text-xs bg-lime-400/20 text-lime-300 border-lime-400/30">
                            Intent: {message.intent}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-lime-400 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-slate-900" />
                    </div>
                    <div className="bg-slate-800/80 text-white rounded-lg p-3 border border-white/20">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-lime-400"></div>
                        <span className="text-sm">DeepTalk is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-white/20 p-4 bg-slate-800/30">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about routes, costs, timing, or anything logistics..."
                  className="flex-1 px-4 py-3 pr-16 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent resize-none bg-slate-800/50 text-white placeholder-indigo-300"
                  rows={2}
                  disabled={isProcessing}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    onClick={startListening}
                    disabled={isListening || isProcessing}
                    className="bg-lime-400/20 text-lime-400 p-2 rounded-full border border-lime-400/30 hover:bg-lime-400/30"
                  >
                    <Mic className={`w-5 h-5 ${isListening ? "animate-pulse" : ""}`} />
                  </Button>
                  <Button
                    type="submit"
                    disabled={!input.trim() || isProcessing}
                    className="bg-lime-400 hover:bg-lime-500 text-slate-900 p-2 rounded-full"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <aside className="w-full lg:w-96 space-y-6">
          {/* Quick Queries */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-md overflow-hidden border border-white/20">
            <div className="bg-slate-800/50 px-6 py-4 border-b border-white/20">
              <h3 className="text-lg font-semibold text-white">Quick Queries</h3>
            </div>
            <div className="p-6 space-y-2">
              {quickQueries.map((query, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start border-white/30 text-white hover:bg-white/20 text-xs bg-transparent"
                  onClick={() => !isProcessing && processQuery(query)}
                  disabled={isProcessing}
                >
                  {query}
                </Button>
              ))}
            </div>
          </div>

          {/* Analytics Dashboard */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-md overflow-hidden border border-white/20">
            <div className="bg-slate-800/50 px-6 py-4 border-b border-white/20">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart3 className="text-yellow-400" />
                Live Analytics
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <Clock className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                  <div className="text-white text-sm font-medium">Avg Transit</div>
                  <div className="text-white text-lg font-bold">7.7 days</div>
                </div>

                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-1" />
                  <div className="text-white text-sm font-medium">Avg Cost</div>
                  <div className="text-white text-lg font-bold">$2,167</div>
                </div>

                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <Shield className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                  <div className="text-white text-sm font-medium">Reliability</div>
                  <div className="text-white text-lg font-bold">83%</div>
                </div>

                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <Zap className="w-6 h-6 text-red-400 mx-auto mb-1" />
                  <div className="text-white text-sm font-medium">Risk Level</div>
                  <div className="text-white text-lg font-bold">13%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Route Status */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-md overflow-hidden border border-white/20">
            <div className="bg-slate-800/50 px-6 py-4 border-b border-white/20">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <MapPin className="text-red-400" />
                Route Status
              </h3>
            </div>
            <div className="p-6 space-y-3">
              {routeDatabase.slice(0, 3).map((route) => (
                <div key={route.id} className="bg-white/20 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-white text-sm font-medium">{route.carrier}</div>
                    <Badge
                      className={`text-xs ${
                        route.overallScore > 0.8
                          ? "bg-green-600"
                          : route.overallScore > 0.7
                            ? "bg-yellow-600"
                            : "bg-red-600"
                      }`}
                    >
                      {route.overallScore.toFixed(2)}
                    </Badge>
                  </div>
                  <div className="text-white/80 text-xs">{route.route}</div>
                  <div className="text-white/60 text-xs mt-1">
                    {route.transitTime}d • ${route.cost} • {route.reliability}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* Inline styles for chat bubbles */}
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
