
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Volume2, Sparkles, Settings, CheckCircle, AlertCircle, Zap } from "lucide-react"
import { voiceService } from "@/services/voiceService"

interface SmartVoiceConfigProps {
  isOpen: boolean
  onClose: () => void
  onConfigSave: (config: any) => void
}

export default function SmartVoiceConfig({ isOpen, onClose, onConfigSave }: SmartVoiceConfigProps) {
  const [providers, setProviders] = useState<string[]>([])
  const [selectedProvider, setSelectedProvider] = useState("auto")
  const [openaiKey, setOpenaiKey] = useState("")
  const [elevenLabsKey, setElevenLabsKey] = useState("")
  const [autoFallback, setAutoFallback] = useState(true)
  const [providerStatus, setProviderStatus] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (isOpen) {
      loadConfig()
      checkProviderStatus()
    }
  }, [isOpen])

  const loadConfig = () => {
    const openaiConfig = localStorage.getItem("openai-api-key")
    const elevenLabsConfig = localStorage.getItem("elevenlabs-config")
    
    if (openaiConfig) setOpenaiKey(openaiConfig)
    if (elevenLabsConfig) {
      const config = JSON.parse(elevenLabsConfig)
      setElevenLabsKey(config.apiKey || "")
    }

    setProviders(voiceService.getAvailableProviders())
  }

  const checkProviderStatus = async () => {
    const status: Record<string, boolean> = {}
    
    // Check each provider availability
    const providers = voiceService.getAvailableProviders()
    for (const providerId of providers) {
      // This would need to be implemented in the voice service
      status[providerId] = true // Placeholder
    }
    
    setProviderStatus(status)
  }

  const handleSave = () => {
    const config = {
      selectedProvider,
      autoFallback,
      openaiKey,
      elevenLabsKey
    }

    // Save to localStorage
    if (openaiKey) localStorage.setItem("openai-api-key", openaiKey)
    if (elevenLabsKey) {
      const elevenLabsConfig = {
        apiKey: elevenLabsKey,
        voiceId: "onwK4e9ZLuTAKqWW03F9", // Default Daniel voice
        model: "eleven_multilingual_v2",
        stability: 0.5,
        similarityBoost: 0.5
      }
      localStorage.setItem("elevenlabs-config", JSON.stringify(elevenLabsConfig))
    }

    onConfigSave(config)
    onClose()
  }

  const testVoice = async () => {
    const success = await voiceService.speak("Testing the new smart voice system. DeepCAL is ready to speak!", {
      provider: selectedProvider === "auto" ? undefined : selectedProvider
    })
    
    if (!success) {
      console.error("Voice test failed")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-800/90 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Volume2 className="text-green-400" />
            Smart Voice Configuration
            <Sparkles className="text-yellow-400" />
          </CardTitle>
          <p className="text-white/70 text-sm">
            Configure multiple voice providers with intelligent fallback
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Provider Selection */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Primary Voice Provider
            </label>
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger className="bg-white/10 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/20">
                <SelectItem value="auto" className="text-white hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>Auto-Select Best Available</span>
                  </div>
                </SelectItem>
                <SelectItem value="openai" className="text-white hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded" />
                    <span>OpenAI TTS (Premium)</span>
                  </div>
                </SelectItem>
                <SelectItem value="elevenlabs" className="text-white hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded" />
                    <span>ElevenLabs (Ultra Premium)</span>
                  </div>
                </SelectItem>
                <SelectItem value="webspeech" className="text-white hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded" />
                    <span>Web Speech API (Free)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Provider Status */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">Provider Status</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white">Web Speech</span>
                <Badge className="text-xs bg-green-900/50 text-green-300">Ready</Badge>
              </div>
              <div className="flex items-center gap-2">
                {openaiKey ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                )}
                <span className="text-sm text-white">OpenAI</span>
                <Badge className={openaiKey ? "bg-green-900/50 text-green-300" : "bg-yellow-900/50 text-yellow-300"}>
                  {openaiKey ? "Ready" : "Key Needed"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {elevenLabsKey ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                )}
                <span className="text-sm text-white">ElevenLabs</span>
                <Badge className={elevenLabsKey ? "bg-green-900/50 text-green-300" : "bg-yellow-900/50 text-yellow-300"}>
                  {elevenLabsKey ? "Ready" : "Key Needed"}
                </Badge>
              </div>
            </div>
          </div>

          {/* API Keys */}
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                OpenAI API Key (Recommended)
              </label>
              <Input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
                className="bg-white/10 border-white/30 text-white"
              />
              <p className="text-white/60 text-xs mt-1">
                High quality, affordable voice synthesis
              </p>
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                ElevenLabs API Key (Optional)
              </label>
              <Input
                type="password"
                value={elevenLabsKey}
                onChange={(e) => setElevenLabsKey(e.target.value)}
                placeholder="Enter ElevenLabs API key"
                className="bg-white/10 border-white/30 text-white"
              />
              <p className="text-white/60 text-xs mt-1">
                Premium quality but more expensive
              </p>
            </div>
          </div>

          {/* Smart Features */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Intelligent Fallback</h4>
                <p className="text-white/60 text-sm">Automatically switch to backup when primary fails</p>
              </div>
              <Switch
                checked={autoFallback}
                onCheckedChange={setAutoFallback}
              />
            </div>
          </div>

          {/* Features List */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">🎯 Smart Voice Features</h4>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• Automatic provider switching when credits run out</li>
              <li>• Web Speech API as permanent free fallback</li>
              <li>• Audio caching to reduce API costs</li>
              <li>• Intelligent text preprocessing for natural speech</li>
              <li>• Real-time provider status monitoring</li>
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
              onClick={testVoice} 
              variant="outline" 
              className="border-blue-500/50 text-blue-300 hover:bg-blue-900/20"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Test
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Save Config
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
