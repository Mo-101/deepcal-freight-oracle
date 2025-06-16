
import { useRef, useEffect } from "react"

// DEPRECATED: Use useEnhancedSpeech instead for better voice quality
export function useSpeechSynthesis() {
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  const speakText = (text: string) => {
    if (!synthRef.current) return

    synthRef.current.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 0.8 // Lower pitch for male voice
    utterance.volume = 0.9

    const voices = synthRef.current.getVoices()
    // Prefer male voices
    const preferredVoice =
      voices.find((voice) => 
        voice.lang.includes("en") && 
        (voice.name.toLowerCase().includes("male") || 
         voice.name.toLowerCase().includes("david") || 
         voice.name.toLowerCase().includes("daniel") ||
         voice.name.toLowerCase().includes("alex"))
      ) ||
      voices.find((voice) => voice.lang.includes("en") && voice.name.includes("Google")) ||
      voices.find((voice) => voice.lang.includes("en")) ||
      voices[0]

    if (preferredVoice) utterance.voice = preferredVoice
    
    console.log("DeepCAL speaking with fallback voice:", preferredVoice?.name || "default")
    synthRef.current.speak(utterance)
  }

  return { speakText }
}
