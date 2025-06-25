
import React from "react"
import { Button } from "@/components/ui/button"
import { Settings, Brain, Zap } from "lucide-react"
import ChatInterface from "@/components/deeptalk/ChatInterface"
import SidePanel from "@/components/deeptalk/SidePanel"

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
  onShowVoiceConfig
}: DeepTalkMainProps) {
  return (
    <main className="flex-1 container mx-auto py-8 px-2 sm:px-6 flex flex-col lg:flex-row gap-6">
      <ChatInterface
        messages={messages}
        input={input}
        setInput={setInput}
        isProcessing={isProcessing}
        isListening={isListening}
        onSubmit={onSubmit}
        onStartListening={onStartListening}
      />

      <div className="space-y-4">
        <div className="hidden lg:flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-purple-400/50 bg-purple-900/20 text-purple-300 hover:bg-purple-800/30"
            disabled
          >
            <Brain className="w-4 h-4 mr-2" />
            AI Brain Active
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-yellow-400/50 bg-yellow-900/20 text-yellow-300 hover:bg-yellow-800/30"
            disabled
          >
            <Zap className="w-4 h-4 mr-2" />
            Training: {trainingBufferStatus.count}/{trainingBufferStatus.maxSize}
          </Button>
          <Button
            onClick={onShowVoiceConfig}
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
          onQuickQuery={onQuickQuery}
        />
      </div>
    </main>
  )
}
