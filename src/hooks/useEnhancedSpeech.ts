
import { useState, useCallback } from "react"

interface ElevenLabsConfig {
  apiKey: string
  voiceId: string
  modelId: string
}

export function useEnhancedSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  // Text preprocessing for natural speech
  const preprocessText = (text: string): string => {
    return text
      // Remove emojis for cleaner speech
      .replace(/[🚚🚀💰🥊⏰🛡️🤔🎯📦🌍🤖👑]/gu, "")
      // Convert currency to natural speech
      .replace(/\$(\d+)/g, "$1 dollars")
      // Add pauses after sentences
      .replace(/\./g, ". ")
      // Expand abbreviations
      .replace(/DHL/g, "D.H.L.")
      .replace(/FedEx/g, "Fed Ex")
      // Add natural breaks
      .replace(/!/g, "! ")
      .replace(/\?/g, "? ")
      // Clean up extra spaces
      .replace(/\s+/g, " ")
      .trim()
  }

  const speakWithElevenLabs = async (text: string, config: ElevenLabsConfig) => {
    if (isSpeaking) {
      stopSpeaking()
    }

    setIsSpeaking(true)
    const processedText = preprocessText(text)

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`, {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": config.apiKey,
        },
        body: JSON.stringify({
          text: processedText,
          model_id: config.modelId,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true
          }
        }),
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      const audio = new Audio(audioUrl)
      setAudioElement(audio)
      
      audio.onended = () => {
        setIsSpeaking(false)
        URL.revokeObjectURL(audioUrl)
        setAudioElement(null)
      }
      
      audio.onerror = () => {
        setIsSpeaking(false)
        URL.revokeObjectURL(audioUrl)
        setAudioElement(null)
      }

      await audio.play()
      console.log("DeepCAL speaking with ElevenLabs voice:", config.voiceId)
      
    } catch (error) {
      console.error("ElevenLabs speech error:", error)
      setIsSpeaking(false)
      // Fallback to browser TTS
      fallbackToSystemTTS(processedText)
    }
  }

  const fallbackToSystemTTS = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 0.8
      utterance.volume = 0.9

      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find((voice) => 
        voice.lang.includes("en") && 
        (voice.name.toLowerCase().includes("male") || 
         voice.name.toLowerCase().includes("david") || 
         voice.name.toLowerCase().includes("daniel"))
      ) || voices.find((voice) => voice.lang.includes("en")) || voices[0]

      if (preferredVoice) utterance.voice = preferredVoice
      
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      window.speechSynthesis.speak(utterance)
      console.log("DeepCAL speaking with fallback voice:", preferredVoice?.name || "default")
    }
  }

  const stopSpeaking = () => {
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
      setAudioElement(null)
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
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
