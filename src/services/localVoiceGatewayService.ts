export interface LocalVoiceConfig {
  model: 'vits' | 'speecht5' | 'fastspeech2'
  gatewayUrl: string
}

export interface LocalVoiceRequest {
  text: string
  voice: string
}

export const localVoiceGatewayService = {
  async speak(text: string, config: LocalVoiceConfig, onAudioReady: (audio: HTMLAudioElement) => void) {
    if (!config.gatewayUrl) {
      throw new Error('Local voice gateway URL is required')
    }

    // Create cache key for audio reuse
    const cacheKey = `local_voice_${btoa(text + config.model)}`
    
    // Check if we have cached audio
    const cachedUrl = sessionStorage.getItem(cacheKey)
    if (cachedUrl) {
      console.log(`🎤 Using cached local voice: ${config.model}`)
      const audio = new Audio(cachedUrl)
      audio.volume = 1.0
      audio.play()
      onAudioReady(audio)
      return
    }

    console.log(`🎤 Local voice gateway request: ${text.length} chars, model: ${config.model}`)

    try {
      const response = await fetch(`${config.gatewayUrl}/speak`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          voice: config.model
        } as LocalVoiceRequest)
      })

      if (!response.ok) {
        throw new Error(`Local voice gateway error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      // Cache the audio URL for reuse
      sessionStorage.setItem(cacheKey, audioUrl)
      
      const audio = new Audio(audioUrl)
      audio.preload = 'auto'
      audio.volume = 1.0
      
      console.log(`🎙️ DeepCAL speaking with local ${config.model} voice`)
      
      // Clean up URL when audio ends
      audio.addEventListener('ended', () => {
        // Keep URL in cache for reuse, don't revoke immediately
      })
      
      await audio.play()
      onAudioReady(audio)
      
    } catch (error: any) {
      console.error("🎤 Local voice gateway error:", error)
      
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        throw new Error('LOCAL_GATEWAY_OFFLINE')
      } else {
        throw error
      }
    }
  }
}
