
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface VoiceConfig {
  provider: 'elevenlabs' | 'local'
  apiKey?: string
  voiceId?: string
  modelId?: string
  stability?: number
  similarityBoost?: number
  model?: 'vits' | 'speecht5' | 'fastspeech2'
  gatewayUrl?: string
}

export function useVoiceConfig() {
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig | null>(null)
  const [showVoiceConfig, setShowVoiceConfig] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadVoiceConfig = () => {
      const provider = localStorage.getItem("voice-provider") || "elevenlabs"
      
      if (provider === "elevenlabs") {
        const savedConfig = localStorage.getItem("elevenlabs-config")
        if (savedConfig) {
          try {
            const config = JSON.parse(savedConfig)
            setVoiceConfig({
              provider: "elevenlabs",
              ...config
            })
            console.log('🎤 Loaded ElevenLabs config:', { hasApiKey: !!config.apiKey, voiceId: config.voiceId })
          } catch (error) {
            console.error('Error loading ElevenLabs config:', error)
          }
        }
      } else if (provider === "local") {
        const savedConfig = localStorage.getItem("local-voice-config")
        if (savedConfig) {
          try {
            const config = JSON.parse(savedConfig)
            setVoiceConfig({
              provider: "local",
              ...config
            })
            console.log('🎤 Loaded local voice config:', { model: config.model, gatewayUrl: config.gatewayUrl })
          } catch (error) {
            console.error('Error loading local voice config:', error)
          }
        }
      }
      
      if (!voiceConfig) {
        console.log('🔕 No voice config found - voice will use browser synthesis')
      }
    }
    
    loadVoiceConfig()
  }, [])

  const handleVoiceConfigSave = (config: VoiceConfig) => {
    setVoiceConfig(config)
    console.log('🎤 Voice config updated:', config)
    
    const providerDescription = config.provider === 'elevenlabs' ? 
      `ElevenLabs ${config.voiceId === 'onwK4e9ZLuTAKqWW03F9' ? 'Daniel voice' : 'voice'}` :
      `Local ${config.model?.toUpperCase()} model`
    
    toast({
      title: "🎤 Voice Configuration Saved",
      description: `DeepCAL will now speak with ${providerDescription}`,
      duration: 3000,
    })
  }

  return {
    voiceConfig,
    showVoiceConfig,
    setShowVoiceConfig,
    handleVoiceConfigSave
  }
}
