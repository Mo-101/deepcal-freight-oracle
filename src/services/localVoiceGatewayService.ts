
export interface LocalVoiceConfig {
  model: 'vits' | 'speecht5' | 'fastspeech2'
  gatewayUrl: string
}

export interface LocalVoiceRequest {
  text: string
  voice: string
  chunk_size?: number
  speed?: number
  pitch?: number
}

export const localVoiceGatewayService = {
  async speak(text: string, config: LocalVoiceConfig, onAudioReady: (audio: HTMLAudioElement) => void) {
    if (!config.gatewayUrl) {
      throw new Error('Local voice gateway URL is required')
    }

    // Enhanced preprocessing for better male voice synthesis
    const processedText = text
      // Remove problematic characters that cause TTS issues
      .replace(/[🎯🚀📊⚔️🔥🌊⚖️👑🏆🌟🛡️🧠💫🔬🧙‍♂️☕🤖💰📜⏰🌍⌚✨⚡🎭🎨🔮]/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
      .replace(/\*(.*?)\*/g, '$1') // Remove markdown italic
      .replace(/`(.*?)`/g, '$1') // Remove code formatting
      .replace(/DeepCAL\+\+/g, 'DeepCAL')
      .replace(/TOPSIS/g, 'analysis')
      .replace(/neutrosophic/g, 'advanced')
      .trim()

    // Create cache key for audio reuse
    const cacheKey = `local_voice_${btoa(processedText + config.model)}`
    
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

    console.log(`🎤 Local voice gateway request: ${processedText.length} chars, model: ${config.model}`)

    try {
      const response = await fetch(`${config.gatewayUrl}/speak`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: processedText,
          voice: config.model,
          // Enhanced parameters for smoother male voice
          chunk_size: 200, // Ensure full text processing
          speed: 0.9, // Slightly slower for clarity
          pitch: -0.1 // Lower pitch for male voice
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
      
      console.log(`🎙️ DeepCAL speaking with optimized local ${config.model} voice`)
      
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
