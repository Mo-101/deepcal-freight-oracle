
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Volume2, Sparkles } from "lucide-react"
import VoiceProviderSelector from "./voice/VoiceProviderSelector"
import ElevenLabsVoiceSelector from "./voice/ElevenLabsVoiceSelector"
import LocalVoiceSelector from "./voice/LocalVoiceSelector"

interface VoiceConfigProps {
  isOpen: boolean
  onClose: () => void
  onConfigSave: (config: any) => void
}

export default function VoiceConfig({ isOpen, onClose, onConfigSave }: VoiceConfigProps) {
  const [voiceProvider, setVoiceProvider] = useState("elevenlabs")
  const [apiKey, setApiKey] = useState("")
  const [voiceId, setVoiceId] = useState("onwK4e9ZLuTAKqWW03F9") // Default to Daniel (male)
  const [modelId, setModelId] = useState("eleven_turbo_v2_5") // Optimized for smoothness
  const [localModel, setLocalModel] = useState("vits")
  const [gatewayUrl, setGatewayUrl] = useState("http://localhost:8000")

  useEffect(() => {
    // Load saved config from localStorage
    const savedConfig = localStorage.getItem("elevenlabs-config")
    if (savedConfig) {
      const config = JSON.parse(savedConfig)
      setApiKey(config.apiKey || "")
      setVoiceId(config.voiceId || "onwK4e9ZLuTAKqWW03F9")
      setModelId(config.modelId || "eleven_turbo_v2_5")
    }

    const savedLocalConfig = localStorage.getItem("local-voice-config")
    if (savedLocalConfig) {
      const config = JSON.parse(savedLocalConfig)
      setLocalModel(config.model || "vits")
      setGatewayUrl(config.gatewayUrl || "http://localhost:8000")
    }

    const savedProvider = localStorage.getItem("voice-provider")
    if (savedProvider) {
      setVoiceProvider(savedProvider)
    }
  }, [])

  const handleSave = () => {
    if (voiceProvider === "elevenlabs") {
      const config = { 
        provider: "elevenlabs",
        apiKey, 
        voiceId, 
        modelId,
        stability: 0.7, // Optimized for smoother speech
        similarityBoost: 0.85, // Higher for better voice consistency
        style: 0.3, // Added style for more natural delivery
        useSpeakerBoost: true
      }
      localStorage.setItem("elevenlabs-config", JSON.stringify(config))
      localStorage.setItem("voice-provider", "elevenlabs")
      onConfigSave(config)
    } else if (voiceProvider === "local") {
      const config = {
        provider: "local",
        model: localModel,
        gatewayUrl
      }
      localStorage.setItem("local-voice-config", JSON.stringify(config))
      localStorage.setItem("voice-provider", "local")
      onConfigSave(config)
    }
    
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-slate-800/90 border-white/20 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Volume2 className="text-green-400" />
            DeepCAL Voice Configuration - Male Voices
            <Sparkles className="text-yellow-400" />
          </CardTitle>
          <p className="text-white/70 text-sm">
            Optimized male voices for smooth, professional delivery
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <VoiceProviderSelector value={voiceProvider} onChange={setVoiceProvider} />

          {voiceProvider === "elevenlabs" && (
            <>
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

              <ElevenLabsVoiceSelector value={voiceId} onChange={setVoiceId} />

              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Voice Model Quality (Optimized for Smoothness)
                </label>
                <Select value={modelId} onValueChange={setModelId}>
                  <SelectTrigger className="bg-white/10 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    <SelectItem value="eleven_turbo_v2_5" className="text-white hover:bg-white/10">
                      <div className="flex flex-col">
                        <span className="font-medium">Turbo v2.5 (Recommended)</span>
                        <span className="text-xs text-white/70">Fast, smooth, quota-efficient</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="eleven_multilingual_v2" className="text-white hover:bg-white/10">
                      <div className="flex flex-col">
                        <span className="font-medium">Multilingual v2</span>
                        <span className="text-xs text-white/70">Highest quality, smoothest delivery</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {voiceProvider === "local" && (
            <LocalVoiceSelector
              model={localModel}
              gatewayUrl={gatewayUrl}
              onModelChange={setLocalModel}
              onGatewayUrlChange={setGatewayUrl}
            />
          )}

          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2">🎙️ Smooth Male Voice Optimization</h4>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• All voices optimized for male delivery and smooth speech patterns</li>
              <li>• Enhanced stability settings for consistent tone</li>
              <li>• Improved similarity boost for natural flow</li>
              <li>• Professional male voices for business and technical content</li>
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
              Activate Male Voice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
