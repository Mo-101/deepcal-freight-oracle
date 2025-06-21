
import React from "react"
import DeepCALSymbolicHeader from "@/components/DeepCALSymbolicHeader"
import ChatInterface from "@/components/deeptalk/ChatInterface"
import DeepTalkHeader from "@/components/deeptalk/DeepTalkHeader"
import QuickActionsBar from "@/components/deeptalk/QuickActionsBar"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  intent?: string
  data?: any
}

interface DeepTalkContainerProps {
  messages: Message[]
  input: string
  setInput: (value: string) => void
  isProcessing: boolean
  isListening: boolean
  groqConfigured: boolean
  currentProvider: string | null
  onSubmit: (e: React.FormEvent) => void
  onStartListening: () => void
  onQuickQuery: (query: string) => void
  onShowGroqConfig: () => void
  onShowVoiceConfig: () => void
}

export default function DeepTalkContainer({
  messages,
  input,
  setInput,
  isProcessing,
  isListening,
  groqConfigured,
  currentProvider,
  onSubmit,
  onStartListening,
  onQuickQuery,
  onShowGroqConfig,
  onShowVoiceConfig,
}: DeepTalkContainerProps) {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 overflow-hidden">
      <DeepCALSymbolicHeader />

      <main className="flex-1 flex flex-col min-h-0">
        <DeepTalkHeader
          groqConfigured={groqConfigured}
          currentProvider={currentProvider}
          onShowGroqConfig={onShowGroqConfig}
          onShowVoiceConfig={onShowVoiceConfig}
        />

        <QuickActionsBar onQuickQuery={onQuickQuery} />

        <div className="flex-1 min-h-0">
          <ChatInterface
            messages={messages}
            input={input}
            setInput={setInput}
            isProcessing={isProcessing}
            isListening={isListening}
            onSubmit={onSubmit}
            onStartListening={onStartListening}
          />
        </div>
      </main>
    </div>
  )
}
