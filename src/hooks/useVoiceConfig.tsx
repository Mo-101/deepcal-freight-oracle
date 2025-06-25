
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { openAIVoiceService } from "@/services/openAIVoiceService"

interface VoiceConfig {
  provider: 'openai' | 'browser'
  voice?: string
  model?: string
  speed?: number
}

export function useVoiceConfig() {
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig | null>(null)
  const [showVoiceConfig, setShowVoiceConfig] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadVoiceConfig = () => {
      const hasOpenAIKey = !!localStorage.getItem("openai-api-key")
      
      if (hasOpenAIKey) {
        const savedConfig = localStorage.getItem("openai-voice-config")
        if (savedConfig) {
          try {
            const config = JSON.parse(savedConfig)
            setVoiceConfig({
              provider: "openai",
              ...config
            })
            console.log('🎤 Loaded OpenAI voice config:', config)
          } catch (error) {
            console.error('Error loading OpenAI voice config:', error)
          }
        } else {
          setVoiceConfig({ provider: "openai" })
        }
      } else {
        setVoiceConfig({ provider: "browser" })
        console.log('🔕 No OpenAI key found - using browser speech synthesis')
      }
    }
    
    loadVoiceConfig()
  }, [])

  const handleVoiceConfigSave = (config: VoiceConfig) => {
    setVoiceConfig(config)
    console.log('🎤 Voice config updated:', config)
    
    const description = config.provider === 'openai' ? 
      `OpenAI ${config.voice} voice` :
      'Browser speech synthesis'
    
    toast({
      title: "🎤 Voice Configuration Saved",
      description: `DeepCAL will now speak with ${description}`,
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
