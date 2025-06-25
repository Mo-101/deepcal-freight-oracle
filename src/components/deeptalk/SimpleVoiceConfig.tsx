
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Volume2, Key, TestTube } from "lucide-react"
import { openAIVoiceService } from "@/services/openAIVoiceService"
import { useToast } from "@/hooks/use-toast"

interface SimpleVoiceConfigProps {
  isOpen: boolean
  onClose: () => void
  onConfigSave: (config: any) => void
}

export default function SimpleVoiceConfig({ isOpen, onClose, onConfigSave }: SimpleVoiceConfigProps) {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("")
  const [voice, setVoice] = useState<'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'>("onyx")
  const [model, setModel] = useState<'tts-1' | 'tts-1-hd'>("tts-1")
  const [speed, setSpeed] = useState(1.0)

  useEffect(() => {
    // Load saved OpenAI config
    setApiKey(localStorage.getItem("openai-api-key") || "")
    const savedConfig = localStorage.getItem("openai-voice-config")
    if (savedConfig) {
      const config = JSON.parse(savedConfig)
      setVoice(config.voice || "onyx")
      setModel(config.model || "tts-1")
      setSpeed(config.speed || 1.0)
    }
  }, [])

  const handleSave = () => {
    // Save API key
    if (apiKey.trim()) {
      localStorage.setItem("openai-api-key", apiKey.trim())
    }
    
    // Save voice config with proper typing
    const config = { voice, model, speed }
    openAIVoiceService.updateConfig(config)
    
    onConfigSave({
      provider: "openai",
      ...config
    })
    
    toast({
      title: "🎤 OpenAI Voice Configured",
      description: `DeepCAL will now speak with ${voice} voice`,
      duration: 3000,
    })
    
    onClose()
  }

  const testVoice = async () => {
    try {
      await openAIVoiceService.textToSpeech("Hello! This is DeepCAL testing the voice configuration.")
      toast({
        title: "🔊 Voice Test",
        description: "OpenAI voice is working correctly!",
      })
    } catch (error) {
      toast({
        title: "❌ Voice Test Failed",
        description: "Please check your API key and try again",
        variant: "destructive"
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-slate-800/90 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Volume2 className="text-green-400" />
            OpenAI Voice Configuration
          </CardTitle>
          <p className="text-white/70 text-sm">
            High-quality AI voice powered by OpenAI
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-white text-sm font-medium mb-2 flex items-center gap-2">
              <Key className="w-4 h-4" />
              OpenAI API Key
            </label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="bg-white/10 border-white/30 text-white"
            />
            <p className="text-white/60 text-xs mt-1">
              Get your API key from{" "}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                OpenAI Platform
              </a>
            </p>
          </div>

          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Voice Selection
            </label>
            <Select value={voice} onValueChange={(value: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer') => setVoice(value)}>
              <SelectTrigger className="bg-white/10 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/20">
                {openAIVoiceService.getVoices().map(v => (
                  <SelectItem key={v.id} value={v.id as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'} className="text-white hover:bg-white/10">
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Quality Model
            </label>
            <Select value={model} onValueChange={(value: 'tts-1' | 'tts-1-hd') => setModel(value)}>
              <SelectTrigger className="bg-white/10 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/20">
                <SelectItem value="tts-1" className="text-white hover:bg-white/10">
                  Standard (Fast)
                </SelectItem>
                <SelectItem value="tts-1-hd" className="text-white hover:bg-white/10">
                  HD (High Quality)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Speech Speed: {speed}x
            </label>
            <input
              type="range"
              min="0.25"
              max="2"
              step="0.25"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-lime-400"
            />
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
              className="border-blue-400/50 text-blue-300 hover:bg-blue-800/30"
              disabled={!apiKey.trim()}
            >
              <TestTube className="w-4 h-4 mr-2" />
              Test
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
