
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Volume2, Sparkles } from "lucide-react"

interface VoiceConfigProps {
  isOpen: boolean
  onClose: () => void
  onConfigSave: (config: any) => void
}

export default function VoiceConfig({ isOpen, onClose, onConfigSave }: VoiceConfigProps) {
  const [apiKey, setApiKey] = useState("")
  const [voiceId, setVoiceId] = useState("onwK4e9ZLuTAKqWW03F9") // Daniel - professional male
  const [modelId, setModelId] = useState("eleven_multilingual_v2")

  useEffect(() => {
    // Load saved config from localStorage
    const savedConfig = localStorage.getItem("elevenlabs-config")
    if (savedConfig) {
      const config = JSON.parse(savedConfig)
      setApiKey(config.apiKey || "")
      setVoiceId(config.voiceId || "onwK4e9ZLuTAKqWW03F9")
      setModelId(config.modelId || "eleven_multilingual_v2")
    }
  }, [])

  const handleSave = () => {
    const config = { apiKey, voiceId, modelId }
    localStorage.setItem("elevenlabs-config", JSON.stringify(config))
    onConfigSave(config)
    onClose()
  }

  const voiceOptions = [
    { 
      id: "onwK4e9ZLuTAKqWW03F9", 
      name: "Daniel - DeepCAL Oracle", 
      description: "Professional, wise, perfect for logistics analysis" 
    },
    { 
      id: "JBFqnCBsd6RMkjVDRZzb", 
      name: "George - The Logistics Sage", 
      description: "Deep, authoritative voice for complex explanations" 
    },
    { 
      id: "CwhRBWXzGAHq8TQ4Fs17", 
      name: "Roger - The Strategic Advisor", 
      description: "Mature, thoughtful delivery for strategic insights" 
    },
    { 
      id: "TX3LPaxmHKxFdv7VOQHJ", 
      name: "Liam - The Quick Analyst", 
      description: "Clear, energetic voice for rapid-fire analysis" 
    },
    { 
      id: "bIHbv24MWmeRgasZH58o", 
      name: "Will - The Enthusiastic Guide", 
      description: "Dynamic voice that brings humor to life" 
    },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-slate-800/90 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Volume2 className="text-green-400" />
            DeepCAL Voice Configuration
            <Sparkles className="text-yellow-400" />
          </CardTitle>
          <p className="text-white/70 text-sm">
            Configure DeepCAL's voice personality for optimal logistics wisdom delivery
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              ElevenLabs API Key
            </label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your ElevenLabs API key"
              className="bg-white/10 border-white/30 text-white"
            />
            <p className="text-white/60 text-xs mt-1">
              Get your API key from{" "}
              <a 
                href="https://elevenlabs.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                elevenlabs.io
              </a>
              {" "}for premium voice quality
            </p>
          </div>

          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              DeepCAL Voice Personality
            </label>
            <Select value={voiceId} onValueChange={setVoiceId}>
              <SelectTrigger className="bg-white/10 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/20">
                {voiceOptions.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id} className="text-white hover:bg-white/10">
                    <div className="flex flex-col">
                      <span className="font-medium">{voice.name}</span>
                      <span className="text-xs text-white/70">{voice.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-white/60 text-xs mt-1">
              Each voice brings a unique personality to DeepCAL's logistics wisdom
            </p>
          </div>

          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Voice Model Quality
            </label>
            <Select value={modelId} onValueChange={setModelId}>
              <SelectTrigger className="bg-white/10 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/20">
                <SelectItem value="eleven_multilingual_v2" className="text-white hover:bg-white/10">
                  <div className="flex flex-col">
                    <span className="font-medium">Multilingual v2</span>
                    <span className="text-xs text-white/70">Best quality, emotionally rich (Recommended)</span>
                  </div>
                </SelectItem>
                <SelectItem value="eleven_turbo_v2_5" className="text-white hover:bg-white/10">
                  <div className="flex flex-col">
                    <span className="font-medium">Turbo v2.5</span>
                    <span className="text-xs text-white/70">Fast response, good quality</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">🎯 Voice Enhancement Features</h4>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• Intelligent text preprocessing for natural speech</li>
              <li>• Enhanced pronunciation of logistics terminology</li>
              <li>• Automatic pacing for complex analytical content</li>
              <li>• Humor and wisdom delivery optimization</li>
            </ul>
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
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Activate Voice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
