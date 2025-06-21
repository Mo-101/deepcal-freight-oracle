
import type { VoiceProvider } from '../voiceService'

export class WebSpeechProvider implements VoiceProvider {
  id = 'webspeech'
  name = 'Web Speech API'
  type = 'web' as const
  private synthesis: SpeechSynthesis | null = null
  private currentUtterance: SpeechSynthesisUtterance | null = null

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis
    }
  }

  async isAvailable(): Promise<boolean> {
    return !!(this.synthesis && typeof window !== 'undefined')
  }

  async speak(text: string, options?: any): Promise<HTMLAudioElement | null> {
    if (!this.synthesis) {
      throw new Error('Web Speech API not available')
    }

    return new Promise((resolve) => {
      // Stop any current speech
      this.stop()

      const utterance = new SpeechSynthesisUtterance(text)
      this.currentUtterance = utterance

      // Configure voice settings
      utterance.rate = options?.rate || 0.9
      utterance.pitch = options?.pitch || 1
      utterance.volume = options?.volume || 1

      // Try to find a good voice
      const voices = this.synthesis!.getVoices()
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.name.includes('Google')
      ) || voices.find(voice => voice.lang.startsWith('en'))

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.onstart = () => {
        console.log('🎤 Web Speech: Started speaking')
      }

      utterance.onend = () => {
        console.log('🎤 Web Speech: Finished speaking')
        this.currentUtterance = null
        resolve(null) // Web Speech doesn't return audio element
      }

      utterance.onerror = (error) => {
        console.error('Web Speech error:', error)
        this.currentUtterance = null
        resolve(null)
      }

      this.synthesis!.speak(utterance)
    })
  }

  stop() {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
    this.currentUtterance = null
  }

  getVoices(): string[] {
    if (!this.synthesis) return []
    
    return this.synthesis.getVoices()
      .filter(voice => voice.lang.startsWith('en'))
      .map(voice => voice.name)
  }
}
