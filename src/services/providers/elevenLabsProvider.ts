
import type { VoiceProvider } from '../voiceService'

export interface ElevenLabsConfig {
  apiKey: string
  voiceId: string
  model: string
  stability: number
  similarityBoost: number
}

export class ElevenLabsProvider implements VoiceProvider {
  id = 'elevenlabs'
  name = 'ElevenLabs'
  type = 'api' as const
  private config: ElevenLabsConfig | null = null
  private currentAudio: HTMLAudioElement | null = null

  constructor(config?: ElevenLabsConfig) {
    if (config) {
      this.config = config
    } else {
      // Try to load from localStorage
      const savedConfig = localStorage.getItem('elevenlabs-config')
      if (savedConfig) {
        this.config = JSON.parse(savedConfig)
      }
    }
  }

  setConfig(config: ElevenLabsConfig) {
    this.config = config
    localStorage.setItem('elevenlabs-config', JSON.stringify(config))
  }

  async isAvailable(): Promise<boolean> {
    return !!(this.config && this.config.apiKey)
  }

  async speak(text: string, options?: any): Promise<HTMLAudioElement | null> {
    if (!this.config) {
      throw new Error('ElevenLabs configuration not available')
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.config.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.config.apiKey
        },
        body: JSON.stringify({
          text,
          model_id: this.config.model,
          voice_settings: {
            stability: this.config.stability,
            similarity_boost: this.config.similarityBoost
          }
        })
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      
      console.log('🎤 ElevenLabs: Audio generated successfully')
      
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
      console.error('ElevenLabs error:', error)
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
    return [
      'onwK4e9ZLuTAKqWW03F9', // Daniel
      'JBFqnCBsd6RMkjVDRZzb', // George
      'CwhRBWXzGAHq8TQ4Fs17', // Roger
      'TX3LPaxmHKxFdv7VOQHJ', // Liam
      'bIHbv24MWmeRgasZH58o'  // Will
    ]
  }
}
