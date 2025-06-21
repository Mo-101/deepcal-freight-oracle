
import type { VoiceProvider } from '../voiceService'

export class OpenAITTSProvider implements VoiceProvider {
  id = 'openai'
  name = 'OpenAI TTS'
  type = 'api' as const
  private apiKey: string = ''
  private currentAudio: HTMLAudioElement | null = null

  constructor(apiKey?: string) {
    this.apiKey = apiKey || localStorage.getItem('openai-api-key') || ''
  }

  setApiKey(key: string) {
    this.apiKey = key
    localStorage.setItem('openai-api-key', key)
  }

  async isAvailable(): Promise<boolean> {
    return !!this.apiKey && this.apiKey.startsWith('sk-')
  }

  async speak(text: string, options?: any): Promise<HTMLAudioElement | null> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: options?.voice || 'nova', // nova, alloy, echo, fable, onyx, shimmer
          response_format: 'mp3',
          speed: options?.rate || 1.0
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI TTS API error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      
      console.log('🎤 OpenAI TTS: Audio generated successfully')
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
        this.currentAudio = null
      }

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl)
        this.currentAudio = null
      }

      this.currentAudio = audio
      await audio.play()
      
      return audio
    } catch (error) {
      console.error('OpenAI TTS error:', error)
      throw error
    }
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
      this.currentAudio = null
    }
  }

  getVoices(): string[] {
    return ['nova', 'alloy', 'echo', 'fable', 'onyx', 'shimmer']
  }
}
