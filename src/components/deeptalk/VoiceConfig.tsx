
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
    const config = { 
      apiKey, 
      voiceId, 
      modelId,
      stability: 0.5,
      similarityBoost: 0.75
    }
    localStorage.setItem("elevenlabs-config", JSON.stringify(config))
    onConfigSave(config)
    onClose()
  }

  const voiceOptions = [
    { 
      id: "onwK4e9ZLuTAKqWW03F9", 
      name: "Daniel - Professional Oracle", 
      description: "Professional, wise, perfect for logistics analysis",
      region: "Global"
    },
    { 
      id: "JBFqnCBsd6RMkjVDRZzb", 
      name: "George - Deep Authority", 
      description: "Deep, authoritative voice for complex explanations",
      region: "Global" 
    },
    { 
      id: "TX3LPaxmHKxFdv7VOQHJ", 
      name: "Liam - Quick Analyst", 
      description: "Clear, energetic voice for rapid-fire analysis",
      region: "Global"
    },
    { 
      id: "bIHbv24MWmeRgasZH58o", 
      name: "Will - Enthusiastic Guide", 
      description: "Dynamic voice that brings humor to life",
      region: "Global"
    },
    { 
      id: "9BWtsMINqrJLrRacOk9x", 
      name: "Aria - African Wisdom", 
      description: "Warm, wise African female voice with natural accent",
      region: "African"
    },
    { 
      id: "EXAVITQu4vr4xnSDxMaL", 
      name: "Sarah - African Professional", 
      description: "Professional African female voice, perfect for business",
      region: "African"
    },
    { 
      id: "cgSgspJ2msm6clMCkdW9", 
      name: "Jessica - African Storyteller", 
      description: "Rich, storytelling African voice with cultural depth",
      region: "African"
    }
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
            Configure DeepCAL's voice personality for natural speech delivery
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
              {" "}for premium natural voice quality
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
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{voice.name}</span>
                        {voice.region === "African" && (
                          <span className="text-xs bg-orange-600 px-2 py-0.5 rounded text-white">
                            🌍 African
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-white/70">{voice.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-white/60 text-xs mt-1">
              African voices bring authentic cultural depth to DeepCAL's logistics wisdom
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
                <SelectItem value="eleven_turbo_v2_5" className="text-white hover:bg-white/10">
                  <div className="flex flex-col">
                    <span className="font-medium">Turbo v2.5 (Recommended)</span>
                    <span className="text-xs text-white/70">Fast, natural, quota-efficient</span>
                  </div>
                </SelectItem>
                <SelectItem value="eleven_multilingual_v2" className="text-white hover:bg-white/10">
                  <div className="flex flex-col">
                    <span className="font-medium">Multilingual v2</span>
                    <span className="text-xs text-white/70">Highest quality, uses more quota</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-4">
            <h4 className="text-amber-400 font-medium mb-2">💡 Voice Enhancement Tips</h4>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• Responses now speak 4 sentences for fuller conversations</li>
              <li>• African voices provide authentic cultural perspectives</li>
              <li>• Browser speech synthesis available as free fallback</li>
              <li>• Check your quota at elevenlabs.io dashboard</li>
            </ul>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">🎯 Voice Features</h4>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• Intelligent text preprocessing for natural speech</li>
              <li>• Automatic quota monitoring and optimization</li>
              <li>• Enhanced pronunciation of logistics terminology</li>
              <li>• Fallback to browser speech when needed</li>
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
