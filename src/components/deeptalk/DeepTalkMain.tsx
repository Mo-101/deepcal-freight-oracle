
import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings } from "lucide-react"
import ChatInterface from "./ChatInterface"
import SidePanel from "./SidePanel"
import DeepTalkHeader from "./DeepTalkHeader"

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

interface DeepTalkMainProps {
  messages: Message[]
  input: string
  setInput: (value: string) => void
  isProcessing: boolean
  isListening: boolean
  routeDatabase: RouteOption[]
  trainingBufferStatus: { count: number; maxSize: number }
  onSubmit: (e: React.FormEvent) => void
  onStartListening: () => void
  onQuickQuery: (query: string) => void
  onShowVoiceConfig: () => void
}

export default function DeepTalkMain({
  messages,
  input,
  setInput,
  isProcessing,
  isListening,
  routeDatabase,
  trainingBufferStatus,
  onSubmit,
  onStartListening,
  onQuickQuery,
  onShowVoiceConfig,
}: DeepTalkMainProps) {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <DeepTalkHeader onShowVoiceConfig={onShowVoiceConfig} />

      {/* Main Content */}
      <div className="flex-1 flex gap-6 p-6 min-h-0">
        {/* Chat Interface - Full Height */}
        <ChatInterface
          messages={messages}
          input={input}
          setInput={setInput}
          isProcessing={isProcessing}
          isListening={isListening}
          onSubmit={onSubmit}
          onStartListening={onStartListening}
        />

        {/* Side Panel */}
        <SidePanel
          routeDatabase={routeDatabase}
          trainingBufferStatus={trainingBufferStatus}
          onQuickQuery={onQuickQuery}
        />
      </div>
    </div>
  )
}
