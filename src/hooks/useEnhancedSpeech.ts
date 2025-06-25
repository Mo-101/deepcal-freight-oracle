
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
    
    // Check text length and warn if too long
    if (processedText.length > 300) {
      console.warn(`Text length ${processedText.length} might exceed quota. Consider shortening.`)
    }
    
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
      
    } catch (error: any) {
      console.error("ElevenLabs speech error:", error)
      setIsSpeaking(false)
      
      // Handle specific quota errors
      if (error.message?.includes('401') || error.message?.includes('quota')) {
        console.log("🔊 ElevenLabs quota exceeded. Try using a shorter message or check your API key.")
        // Try browser speech synthesis as fallback
        tryBrowserSpeech(processedText)
      }
    }
  }

  const tryBrowserSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 0.8
      
      // Try to use a natural voice
      const voices = speechSynthesis.getVoices()
      const naturalVoice = voices.find(voice => 
        voice.name.includes('Natural') || 
        voice.name.includes('Enhanced') ||
        voice.lang.startsWith('en')
      )
      
      if (naturalVoice) {
        utterance.voice = naturalVoice
      }
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      speechSynthesis.speak(utterance)
      console.log("🔊 Using browser speech synthesis as fallback")
    }
  }

  const stopSpeaking = () => {
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
      setAudioElement(null)
    }
    
    // Also stop browser speech if active
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
    
    setIsSpeaking(false)
  }

  const speakText = useCallback((text: string, elevenLabsConfig?: ElevenLabsConfig) => {
    if (elevenLabsConfig && elevenLabsConfig.apiKey) {
      speakWithElevenLabs(text, elevenLabsConfig)
    } else {
      console.log("🔊 No ElevenLabs API key, using browser speech synthesis")
      tryBrowserSpeech(preprocessText(text))
    }
  }, [audioElement, isSpeaking])

  return {
    speakText,
    isSpeaking,
    stopSpeaking
  }
}
