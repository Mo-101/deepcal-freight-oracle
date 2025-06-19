
import React, { useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-md overflow-hidden flex flex-col oracle-card border border-white/20 h-full">
        <div className="bg-slate-800/50 px-6 py-3 border-b border-white/20 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <MessageSquare className="text-blue-400" />
            DeepTalk AI Conversation
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-indigo-200">DeepCAL Oracle</span>
            <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto flex flex-col min-h-0" id="chatContainer">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
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
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
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
                    <Zap className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span className="text-sm">DeepCAL Oracle is channeling wisdom...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        <div className="flex-shrink-0">
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
