
export interface SystemTTSService {
  speak: (text: string, onEnd: () => void, onError: () => void) => void
  stop: () => void
}

export const systemTTSService: SystemTTSService = {
  speak(text: string, onEnd: () => void, onError: () => void) {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9        // Slightly slower for clarity
      utterance.pitch = 0.7       // Lower pitch for authority
      utterance.volume = 0.9

      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find((voice) => 
        voice.lang.includes("en") && 
        (voice.name.toLowerCase().includes("male") || 
         voice.name.toLowerCase().includes("david") || 
         voice.name.toLowerCase().includes("daniel") ||
         voice.name.toLowerCase().includes("alex") ||
         voice.name.toLowerCase().includes("george"))
      ) || voices.find((voice) => voice.lang.includes("en")) || voices[0]

      if (preferredVoice) utterance.voice = preferredVoice
      
      utterance.onend = onEnd
      utterance.onerror = onError
      
      window.speechSynthesis.speak(utterance)
      console.log("DeepCAL speaking with enhanced fallback voice:", preferredVoice?.name || "default")
    }
  },

  stop() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }
}
