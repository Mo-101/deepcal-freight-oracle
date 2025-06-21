
import { useState, useCallback, useEffect } from "react"
import { voiceService } from "@/services/voiceService"
import { WebSpeechProvider } from "@/services/providers/webSpeechProvider"
import { OpenAITTSProvider } from "@/services/providers/openaiTTSProvider"
import { ElevenLabsProvider } from "@/services/providers/elevenLabsProvider"
import { preprocessText } from '@/utils/textPreprocessor'

export function useSmartSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentProvider, setCurrentProvider] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize voice service with all providers
  useEffect(() => {
    if (!isInitialized) {
      // Register all providers
      voiceService.registerProvider(new WebSpeechProvider())
      voiceService.registerProvider(new OpenAITTSProvider())
      voiceService.registerProvider(new ElevenLabsProvider())
      
      setIsInitialized(true)
      console.log('🎤 Smart voice service initialized with all providers')
    }
  }, [isInitialized])

  const speakText = useCallback(async (text: string, options?: { provider?: string }) => {
    if (isSpeaking) {
      stopSpeaking()
    }

    setIsSpeaking(true)
    const processedText = preprocessText(text)
    
    try {
      const success = await voiceService.speak(processedText, {
        provider: options?.provider
      })

      if (success) {
        const provider = voiceService.getCurrentProvider()
        setCurrentProvider(provider?.name || null)
        console.log(`🎤 Speaking with ${provider?.name || 'unknown provider'}`)
      } else {
        console.warn('❌ All voice providers failed')
        setIsSpeaking(false)
      }

      // Set a timeout to reset speaking state (fallback)
      setTimeout(() => {
        setIsSpeaking(false)
      }, Math.max(processedText.length * 100, 2000)) // Estimate based on text length

    } catch (error) {
      console.error("Smart speech error:", error)
      setIsSpeaking(false)
    }
  }, [isSpeaking])

  const stopSpeaking = useCallback(() => {
    voiceService.stop()
    setIsSpeaking(false)
    setCurrentProvider(null)
  }, [])

  const getProviderStatus = useCallback(() => {
    return {
      current: currentProvider,
      available: voiceService.getAvailableProviders()
    }
  }, [currentProvider])

  return {
    speakText,
    isSpeaking,
    stopSpeaking,
    currentProvider,
    getProviderStatus,
    isInitialized
  }
}
