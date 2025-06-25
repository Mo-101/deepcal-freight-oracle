
import { useState, useCallback } from "react"
import { preprocessText } from '@/utils/textPreprocessor'
import { elevenLabsService, type ElevenLabsConfig } from '@/services/elevenLabsService'
import { localVoiceGatewayService, type LocalVoiceConfig } from '@/services/localVoiceGatewayService'

interface VoiceConfig {
  provider: 'elevenlabs' | 'local'
  // ElevenLabs config
  apiKey?: string
  voiceId?: string
  modelId?: string
  stability?: number
  similarityBoost?: number
  // Local gateway config
  model?: 'vits' | 'speecht5' | 'fastspeech2'
  gatewayUrl?: string
}

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
      
      if (error.message?.includes('401') || error.message?.includes('quota')) {
        console.log("🔊 ElevenLabs quota exceeded. Falling back to browser speech.")
        throw new Error('QUOTA_EXCEEDED')
      } else {
        throw error
      }
    }
  }

  const speakWithLocalGateway = async (text: string, config: LocalVoiceConfig) => {
    if (isSpeaking) {
      stopSpeaking()
    }

    setIsSpeaking(true)
    const processedText = preprocessText(text)
    
    console.log(`🎤 Local gateway speech request: ${processedText.length} chars, model: ${config.model}`)
    
    try {
      await localVoiceGatewayService.speak(processedText, config, (audio) => {
        setAudioElement(audio)
        
        audio.onended = () => {
          console.log('🎤 Local gateway speech completed')
          setIsSpeaking(false)
          setAudioElement(null)
        }
        
        audio.onerror = (error) => {
          console.error('🎤 Local gateway audio error:', error)
          setIsSpeaking(false)
          setAudioElement(null)
        }
      })
      
    } catch (error: any) {
      console.error("🎤 Local gateway speech error:", error)
      setIsSpeaking(false)
      
      if (error.message?.includes('LOCAL_GATEWAY_OFFLINE')) {
        console.log("🔊 Local gateway offline. Falling back to browser speech.")
        throw new Error('GATEWAY_OFFLINE')
      } else {
        throw error
      }
    }
  }

  const tryBrowserSpeech = (text: string) => {
    console.log('🔊 Starting browser speech synthesis')
    
    if (!('speechSynthesis' in window)) {
      console.error('🔊 Browser speech synthesis not supported')
      return
    }

    speechSynthesis.cancel()
    
    const processedText = preprocessText(text)
    const utterance = new SpeechSynthesisUtterance(processedText)
    
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 0.8
    
    const voices = speechSynthesis.getVoices()
    
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
    
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
      setAudioElement(null)
    }
    
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
    
    setIsSpeaking(false)
  }

  const speakText = useCallback(async (text: string, voiceConfig?: VoiceConfig) => {
    stopSpeaking()
    
    console.log('🎯 Speech request:', { 
      textLength: text.length, 
      provider: voiceConfig?.provider,
      hasConfig: !!voiceConfig 
    })
    
    if (voiceConfig?.provider === 'elevenlabs' && voiceConfig.apiKey) {
      try {
        const elevenLabsConfig: ElevenLabsConfig = {
          apiKey: voiceConfig.apiKey,
          voiceId: voiceConfig.voiceId || 'onwK4e9ZLuTAKqWW03F9',
          model: voiceConfig.modelId || 'eleven_multilingual_v2',
          stability: voiceConfig.stability || 0.5,
          similarityBoost: voiceConfig.similarityBoost || 0.75
        }
        await speakWithElevenLabs(text, elevenLabsConfig)
        return
      } catch (error: any) {
        console.warn('🎤 ElevenLabs failed, falling back to browser speech:', error.message)
      }
    } else if (voiceConfig?.provider === 'local' && voiceConfig.gatewayUrl) {
      try {
        const localConfig: LocalVoiceConfig = {
          model: voiceConfig.model || 'vits',
          gatewayUrl: voiceConfig.gatewayUrl
        }
        await speakWithLocalGateway(text, localConfig)
        return
      } catch (error: any) {
        console.warn('🎤 Local gateway failed, falling back to browser speech:', error.message)
      }
    } else {
      console.log("🔊 No voice provider configured, using browser speech synthesis")
    }
    
    tryBrowserSpeech(text)
  }, [audioElement, isSpeaking])

  return {
    speakText,
    isSpeaking,
    stopSpeaking
  }
}
