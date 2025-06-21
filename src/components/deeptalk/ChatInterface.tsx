
import React, { useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Bot, User, MessageSquare, Brain, Zap } from "lucide-react"
import ChatInput from "./ChatInput"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  intent?: string
  data?: any
}

interface ChatInterfaceProps {
  messages: Message[]
  input: string
  setInput: (value: string) => void
  isProcessing: boolean
  isListening: boolean
  onSubmit: (e: React.FormEvent) => void
  onStartListening: () => void
}

export default function ChatInterface({
  messages,
  input,
  setInput,
  isProcessing,
  isListening,
  onSubmit,
  onStartListening,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="h-full flex flex-col">
      {/* Messages Container - ChatGPT Style */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`w-full ${
                  message.type === "user" 
                    ? "bg-transparent" 
                    : "bg-slate-800/30"
                }`}
              >
                <div className="max-w-4xl mx-auto px-6 py-6">
                  <div className="flex gap-6">
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === "user" ? "bg-blue-600" : "bg-lime-400"
                      }`}
                    >
                      {message.type === "user" ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-slate-900" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-base leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </div>
                      
                      {/* Message Metadata */}
                      {(message.intent || message.data?.groqPowered) && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {message.intent && (
                            <Badge className="text-xs bg-lime-400/20 text-lime-300 border-lime-400/30">
                              Intent: {message.intent}
                            </Badge>
                          )}
                          {message.data?.groqPowered && (
                            <Badge className="text-xs bg-purple-400/20 text-purple-300 border-purple-400/30">
                              <Brain className="w-3 h-3 mr-1" />
                              AI Enhanced
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="w-full bg-slate-800/30">
                <div className="max-w-4xl mx-auto px-6 py-6">
                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-full bg-lime-400 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-slate-900" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 text-white">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-lime-400"></div>
                        <Zap className="w-4 h-4 text-purple-400 animate-pulse" />
                        <span>DeepCAL Oracle is channeling wisdom...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input - Fixed at Bottom */}
      <div className="border-t border-white/10 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={onSubmit}
            onStartListening={onStartListening}
            isProcessing={isProcessing}
            isListening={isListening}
          />
        </div>
      </div>
    </div>
  )
}
