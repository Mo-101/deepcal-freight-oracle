
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
    
    console.log(`🎤 ElevenLabs speech request: ${processedText.length} chars`)
    
    try {
      await elevenLabsService.speak(processedText, config, (audio) => {
        setAudioElement(audio)
        
        audio.onended = () => {
          console.log('🎤 ElevenLabs speech completed')
          setIsSpeaking(false)
          setAudioElement(null)
        }
        
        audio.onerror = (error) => {
          console.error('🎤 ElevenLabs audio error:', error)
          setIsSpeaking(false)
          setAudioElement(null)
        }
      })
      
    } catch (error: any) {
      console.error("🎤 ElevenLabs speech error:", error)
      setIsSpeaking(false)
      
      // Handle specific quota errors and fallback
      if (error.message?.includes('401') || error.message?.includes('quota')) {
        console.log("🔊 ElevenLabs quota exceeded. Falling back to browser speech.")
        throw new Error('QUOTA_EXCEEDED') // Let the caller handle fallback
      } else {
        throw error // Re-throw other errors
      }
    }
  }

  const tryBrowserSpeech = (text: string) => {
    console.log('🔊 Starting browser speech synthesis')
    
    if (!('speechSynthesis' in window)) {
      console.error('🔊 Browser speech synthesis not supported')
      return
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel()
    
    const processedText = preprocessText(text)
    const utterance = new SpeechSynthesisUtterance(processedText)
    
    // Enhanced voice settings for more natural speech
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 0.8
    
    // Try to use the best available voice
    const voices = speechSynthesis.getVoices()
    
    // Prefer natural/enhanced voices
    const naturalVoice = voices.find(voice => 
      voice.name.includes('Natural') || 
      voice.name.includes('Enhanced') ||
      voice.name.includes('Premium') ||
      (voice.lang.startsWith('en') && voice.name.includes('Google'))
    ) || voices.find(voice => voice.lang.startsWith('en') && voice.default)
    
    if (naturalVoice) {
      utterance.voice = naturalVoice
      console.log(`🔊 Using voice: ${naturalVoice.name}`)
    } else {
      console.log('🔊 Using default browser voice')
    }
    
    utterance.onstart = () => {
      console.log('🔊 Browser speech started')
      setIsSpeaking(true)
    }
    
    utterance.onend = () => {
      console.log('🔊 Browser speech completed')
      setIsSpeaking(false)
    }
    
    utterance.onerror = (error) => {
      console.error('🔊 Browser speech error:', error)
      setIsSpeaking(false)
    }
    
    speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    console.log('🛑 Stopping all speech')
    
    // Stop ElevenLabs audio
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
      setAudioElement(null)
    }
    
    // Stop browser speech
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
    
    setIsSpeaking(false)
  }

  const speakText = useCallback(async (text: string, elevenLabsConfig?: ElevenLabsConfig) => {
    // Stop any current speech
    stopSpeaking()
    
    console.log('🎯 Speech request:', { 
      textLength: text.length, 
      hasElevenLabsConfig: !!elevenLabsConfig,
      hasApiKey: !!(elevenLabsConfig?.apiKey) 
    })
    
    if (elevenLabsConfig?.apiKey) {
      try {
        await speakWithElevenLabs(text, elevenLabsConfig)
        return // Success with ElevenLabs
      } catch (error: any) {
        console.warn('🎤 ElevenLabs failed, falling back to browser speech:', error.message)
        // Fall through to browser speech
      }
    } else {
      console.log("🔊 No ElevenLabs API key, using browser speech synthesis")
    }
    
    // Fallback to browser speech
    tryBrowserSpeech(text)
  }, [audioElement, isSpeaking])

  return {
    speakText,
    isSpeaking,
    stopSpeaking
  }
}
