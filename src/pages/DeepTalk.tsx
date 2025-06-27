import React, { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, Mic, Send, Loader } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSpeechToText } from "@/hooks/useSpeechToText"
import { useTrainingBuffer } from "@/hooks/useTrainingBuffer"
import DeepTalkMain from "@/components/deeptalk/DeepTalkMain"
import VoiceConfigModal from "@/components/deeptalk/VoiceConfigModal"
import { deepcalVoiceService } from "@/services/deepcalVoiceService"
import { generateSymbolicResponse, generateGeneralSymbolicResponse } from '@/utils/deepcal/symbolicResponseAdapter';

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
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [routeDatabase, setRouteDatabase] = useState<RouteOption[]>([])
  const [context, setContext] = useState<any>({})
  const [showVoiceConfig, setShowVoiceConfig] = useState(false)
  const { toast } = useToast()
  const {
    isListening,
    startListening,
    stopListening,
    transcript,
    resetTranscript
  } = useSpeechToText()
  const { trainingBufferStatus, addToTrainingBuffer } = useTrainingBuffer()

  // Load route database on mount
  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const routeData = await import("@/data/routeDatabase.json")
        setRouteDatabase(routeData.default)
      } catch (error) {
        console.error("Failed to load route database:", error)
        toast({
          title: "Route Database Load Failed",
          description: "Could not load route data. Some features may be unavailable.",
          variant: "destructive"
        })
      }
    }

    loadRoutes()
  }, [toast])

  // Update input from speech-to-text
  useEffect(() => {
    if (transcript) {
      setInput(transcript)
    }
  }, [transcript])

  // Quick query handler
  const handleQuickQuery = (query: string) => {
    setInput(query)
    handleSubmit(new Event("submit")) // Simulate form submission
  }

  // Start/stop listening
  const handleStartListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  // Voice config modal
  const handleShowVoiceConfig = () => {
    setShowVoiceConfig(true)
  }

  const handleCloseVoiceConfig = () => {
    setShowVoiceConfig(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: "user", 
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    try {
      // Use symbolic response generation instead of hardcoded responses
      const response = generateSymbolicResponse(
        'general', // Will be determined by the symbolic system
        {},
        input,
        routeDatabase,
        context,
        setContext
      );

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        type: "assistant",
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Add to training buffer for continuous learning
      addToTrainingBuffer({
        query: input,
        response: response,
        timestamp: new Date(),
        confidence: 0.8 // This would come from the symbolic system
      });

    } catch (error) {
      console.error('Symbolic response generation failed:', error);
      
      // Fallback to general symbolic response
      const fallbackResponse = generateGeneralSymbolicResponse();
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        type: "assistant", 
        content: fallbackResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <DeepTalkMain
        messages={messages}
        input={input}
        setInput={setInput}
        isProcessing={isProcessing}
        isListening={isListening}
        routeDatabase={routeDatabase}
        trainingBufferStatus={trainingBufferStatus}
        onSubmit={handleSubmit}
        onStartListening={handleStartListening}
        onQuickQuery={handleQuickQuery}
        onShowVoiceConfig={handleShowVoiceConfig}
      />

      <VoiceConfigModal
        open={showVoiceConfig}
        onClose={handleCloseVoiceConfig}
      />
    </div>
  )
}

export default DeepTalk;
