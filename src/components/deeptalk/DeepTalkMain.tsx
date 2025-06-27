
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
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
             DeepTalk - Symbolic Mouthpiece
            </h1>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </div>
  )
}

}
