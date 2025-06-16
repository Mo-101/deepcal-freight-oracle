
export const systemTTSService = {
  speak(text: string, onEnd?: () => void, onError?: () => void) {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 0.8
      
      if (onEnd) {
        utterance.onend = onEnd
      }
      
      if (onError) {
        utterance.onerror = onError
      }
      
      window.speechSynthesis.speak(utterance)
    } else {
      console.warn('Speech synthesis not supported')
      if (onError) onError()
    }
  },

  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }
}
