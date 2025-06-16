
"use client"

import type React from "react"
import { useState } from "react"
import DeepCALHeader from "@/components/DeepCALHeader"
import ChatInterface from "@/components/deeptalk/ChatInterface"
import SidePanel from "@/components/deeptalk/SidePanel"
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { classifyIntent } from "@/utils/intentClassifier"
import { generateResponse } from "@/utils/responseGenerator"

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
  const [context, setContext] = useState<any>({})

  const { speakText } = useSpeechSynthesis()
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
    const response = generateResponse(intent, params, query, routeDatabase, context, setContext)

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

    // Speak the response with male voice - DeepCAL speaks!
    const cleanResponse = response.replace(/[🚚🚀💰🥊⏰🛡️🤔🎯📦🌍🤖👑]/gu, "")
    console.log("DeepCAL is speaking:", cleanResponse)
    speakText(cleanResponse)
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900" style={{
      fontFamily: "'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'"
    }}>
      <DeepCALHeader />

      <main className="flex-1 container mx-auto py-8 px-2 sm:px-6 flex flex-col lg:flex-row gap-6">
        <ChatInterface
          messages={messages}
          input={input}
          setInput={setInput}
          isProcessing={isProcessing}
          isListening={isListening}
          onSubmit={handleSubmit}
          onStartListening={handleStartListening}
        />

        <SidePanel
          routeDatabase={routeDatabase}
          isProcessing={isProcessing}
          onQuickQuery={handleQuickQuery}
        />
      </main>

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
