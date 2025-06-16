
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Volume2 } from "lucide-react"

interface VoiceConfigProps {
  isOpen: boolean
  onClose: () => void
  onConfigSave: (config: any) => void
}

export default function VoiceConfig({ isOpen, onClose, onConfigSave }: VoiceConfigProps) {
  const [apiKey, setApiKey] = useState("")
  const [voiceId, setVoiceId] = useState("onwK4e9ZLuTAKqWW03F9") // Daniel - male voice
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
    { id: "onwK4e9ZLuTAKqWW03F9", name: "Daniel - Professional Male" },
    { id: "JBFqnCBsd6RMkjVDRZzb", name: "George - Deep Male" },
    { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger - Mature Male" },
    { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam - Young Male" },
    { id: "bIHbv24MWmeRgasZH58o", name: "Will - Energetic Male" },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/90 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Volume2 className="text-green-400" />
            Voice Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            </p>
          </div>

          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Voice Selection
            </label>
            <Select value={voiceId} onValueChange={setVoiceId}>
              <SelectTrigger className="bg-white/10 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {voiceOptions.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    {voice.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Model Quality
            </label>
            <Select value={modelId} onValueChange={setModelId}>
              <SelectTrigger className="bg-white/10 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eleven_multilingual_v2">
                  Multilingual v2 (Best Quality)
                </SelectItem>
                <SelectItem value="eleven_turbo_v2_5">
                  Turbo v2.5 (Fast)
                </SelectItem>
              </SelectContent>
            </Select>
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
              Save & Apply
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
