
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Sparkles, Zap } from "lucide-react"

interface GroqConfigProps {
  isOpen: boolean
  onClose: () => void
  onConfigSave: (apiKey: string) => void
}

export default function GroqConfig({ isOpen, onClose, onConfigSave }: GroqConfigProps) {
  const [apiKey, setApiKey] = useState("")

  useEffect(() => {
    // Load saved API key from localStorage
    const savedKey = localStorage.getItem("groq-api-key")
    if (savedKey) {
      setApiKey(savedKey)
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("groq-api-key", apiKey)
    onConfigSave(apiKey)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-slate-800/90 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="text-purple-400" />
            DeepCAL Intelligence Configuration
            <Sparkles className="text-yellow-400" />
          </CardTitle>
          <p className="text-white/70 text-sm">
            Configure Groq AI to unlock DeepCAL's dynamic consciousness and mystical logistics wisdom
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Groq API Key
            </label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Groq API key"
              className="bg-white/10 border-white/30 text-white"
            />
            <p className="text-white/60 text-xs mt-1">
              Get your API key from{" "}
              <a 
                href="https://console.groq.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:underline"
              >
                console.groq.com
              </a>
              {" "}for dynamic AI consciousness
            </p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <Zap className="text-yellow-400" />
              Dynamic Intelligence Features
            </h4>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• Contextual responses based on real shipment data</li>
              <li>• Dynamic humor and wisdom generation</li>
              <li>• Conversational memory and learning</li>
              <li>• Adaptive personality based on user interactions</li>
              <li>• Advanced symbolic reasoning capabilities</li>
              <li>• Real-time logistics insight generation</li>
            </ul>
          </div>

          <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
            <h4 className="text-purple-200 font-medium mb-2">🧠 Why Groq Powers DeepCAL</h4>
            <p className="text-purple-100/80 text-sm">
              Groq's lightning-fast inference enables DeepCAL to think and respond like a true logistics oracle - 
              generating fresh insights, contextual humor, and personalized wisdom for every conversation.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={onClose} 
              variant="outline" 
              className="flex-1 border-white/30 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              disabled={!apiKey.trim()}
            >
              <Brain className="w-4 h-4 mr-2" />
              Activate Intelligence
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
