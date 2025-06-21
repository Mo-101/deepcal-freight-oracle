
export interface VoiceProvider {
  id: string
  name: string
  type: 'web' | 'api'
  isAvailable: () => Promise<boolean>
  speak: (text: string, options?: any) => Promise<HTMLAudioElement | null>
  stop: () => void
  getVoices?: () => string[]
}

export interface VoiceConfig {
  provider: string
  voice?: string
  rate?: number
  pitch?: number
  volume?: number
}

class VoiceService {
  private providers: Map<string, VoiceProvider> = new Map()
  private currentProvider: VoiceProvider | null = null
  private currentAudio: HTMLAudioElement | null = null
  private cache: Map<string, string> = new Map() // Cache for audio URLs

  registerProvider(provider: VoiceProvider) {
    this.providers.set(provider.id, provider)
  }

  async selectBestProvider(): Promise<VoiceProvider | null> {
    // Priority order: OpenAI TTS > ElevenLabs > Web Speech
    const preferredOrder = ['openai', 'elevenlabs', 'webspeech']
    
    for (const providerId of preferredOrder) {
      const provider = this.providers.get(providerId)
      if (provider && await provider.isAvailable()) {
        this.currentProvider = provider
        console.log(`🎤 Voice provider selected: ${provider.name}`)
        return provider
      }
    }

    // Fallback to any available provider
    for (const [, provider] of this.providers) {
      if (await provider.isAvailable()) {
        this.currentProvider = provider
        console.log(`🎤 Fallback voice provider: ${provider.name}`)
        return provider
      }
    }

    console.warn('❌ No voice providers available')
    return null
  }

  async speak(text: string, config?: VoiceConfig): Promise<boolean> {
    try {
      // Check cache first
      const cacheKey = `${config?.provider || 'auto'}-${text.substring(0, 50)}`
      
      let provider = this.currentProvider
      
      // If specific provider requested, try to use it
      if (config?.provider && this.providers.has(config.provider)) {
        const requestedProvider = this.providers.get(config.provider)!
        if (await requestedProvider.isAvailable()) {
          provider = requestedProvider
        }
      }

      // Auto-select if no provider available
      if (!provider) {
        provider = await this.selectBestProvider()
      }

      if (!provider) {
        console.error('No voice provider available')
        return false
      }

      // Stop current audio if playing
      this.stop()

      // Attempt to speak with selected provider
      const audio = await provider.speak(text, config)
      
      if (audio) {
        this.currentAudio = audio
        return true
      }

      // If primary provider fails, try fallback
      if (provider.id !== 'webspeech') {
        console.log('Primary provider failed, trying Web Speech fallback...')
        const webSpeechProvider = this.providers.get('webspeech')
        if (webSpeechProvider && await webSpeechProvider.isAvailable()) {
          const audio = await webSpeechProvider.speak(text, config)
          if (audio) {
            this.currentAudio = audio
            return true
          }
        }
      }

      return false
    } catch (error) {
      console.error('Voice service error:', error)
      return false
    }
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
      this.currentAudio = null
    }
    
    // Stop all providers
    this.providers.forEach(provider => provider.stop())
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys())
  }

  getCurrentProvider(): VoiceProvider | null {
    return this.currentProvider
  }

  clearCache() {
    this.cache.clear()
  }
}

export const voiceService = new VoiceService()
