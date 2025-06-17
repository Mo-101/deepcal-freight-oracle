
import { useState, useCallback } from "react"
import { preprocessText } from '@/utils/textPreprocessor'
import { elevenLabsService, type ElevenLabsConfig } from '@/services/elevenLabsService'

export function useEnhancedSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  const speakWithElevenLabs = async (text: string, config: ElevenLabsConfig) => {
    if (isSpeaking) {
      stopSpeaking()
    }

    setIsSpeaking(true)
    const processedText = preprocessText(text)
    
    try {
      await elevenLabsService.speak(processedText, config, (audio) => {
        setAudioElement(audio)
        
        audio.onended = () => {
          setIsSpeaking(false)
          setAudioElement(null)
        }
        
        audio.onerror = () => {
          setIsSpeaking(false)
          setAudioElement(null)
        }
      })
      
    } catch (error) {
      console.error("ElevenLabs speech error:", error)
      setIsSpeaking(false)
      // No fallback - voice synthesis requires proper API key
    }
  }

  const stopSpeaking = () => {
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
      setAudioElement(null)
    }
    setIsSpeaking(false)
  }

  const speakText = useCallback((text: string, elevenLabsConfig?: ElevenLabsConfig) => {
    if (elevenLabsConfig && elevenLabsConfig.apiKey) {
      speakWithElevenLabs(text, elevenLabsConfig)
    } else {
      console.log("Voice synthesis requires ElevenLabs API key configuration")
    }
  }, [audioElement, isSpeaking])

  return {
    speakText,
    isSpeaking,
    stopSpeaking
  }
}
