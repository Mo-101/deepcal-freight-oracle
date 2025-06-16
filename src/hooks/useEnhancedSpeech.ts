
import { useState, useCallback } from "react"
import { preprocessText } from '@/utils/textPreprocessor'
import { elevenLabsService, type ElevenLabsConfig } from '@/services/elevenLabsService'
import { systemTTSService } from '@/services/systemTTSService'

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
      // Fallback to browser TTS
      fallbackToSystemTTS(processedText)
    }
  }

  const fallbackToSystemTTS = (text: string) => {
    systemTTSService.speak(
      text,
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    )
  }

  const stopSpeaking = () => {
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
      setAudioElement(null)
    }
    systemTTSService.stop()
    setIsSpeaking(false)
  }

  const speakText = useCallback((text: string, elevenLabsConfig?: ElevenLabsConfig) => {
    if (elevenLabsConfig) {
      speakWithElevenLabs(text, elevenLabsConfig)
    } else {
      const processedText = preprocessText(text)
      fallbackToSystemTTS(processedText)
    }
  }, [audioElement, isSpeaking])

  return {
    speakText,
    isSpeaking,
    stopSpeaking
  }
}
