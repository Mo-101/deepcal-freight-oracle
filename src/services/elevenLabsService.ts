
export interface ElevenLabsConfig {
  apiKey: string
  voiceId: string
  model: string
  stability: number
  similarityBoost: number
  style?: number
  useSpeakerBoost?: boolean
}

export const elevenLabsService = {
  async speak(text: string, config: ElevenLabsConfig, onAudioReady: (audio: HTMLAudioElement) => void) {
    // Validate API key
    if (!config.apiKey || config.apiKey.trim() === '') {
      throw new Error('ElevenLabs API key is required')
    }
    
    // Increased text length limit for fuller responses
    if (text.length > 800) {
      throw new Error(`Text too long (${text.length} chars). Limit to 800 characters to preserve quota.`)
    }

    console.log(`🎤 ElevenLabs API call: ${text.length} chars, voice: ${config.voiceId} (optimized for smooth male voice)`)

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': config.apiKey.trim()
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: config.model || 'eleven_turbo_v2_5', // Default to turbo for smoother delivery
        voice_settings: {
          stability: config.stability || 0.7, // Higher stability for smoother speech
          similarity_boost: config.similarityBoost || 0.85, // Higher for consistent male voice
          style: config.style || 0.3, // Added style for natural expression
          use_speaker_boost: config.useSpeakerBoost !== false // Default to true for clearer male voice
        },
        output_format: 'mp3_44100_128', // Higher quality for better male voice reproduction
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      console.error('🎤 ElevenLabs API error:', response.status, errorData)
      
      if (response.status === 401) {
        if (errorData.detail?.message?.includes('quota')) {
          throw new Error(`ElevenLabs quota exceeded: ${errorData.detail.message}`)
        }
        throw new Error('ElevenLabs API key invalid or expired')
      }
      
      if (response.status === 429) {
        throw new Error('ElevenLabs rate limit exceeded. Please wait a moment.')
      }
      
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorData.detail?.message || 'Unknown error'}`)
    }

    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(audioUrl)
    
    // Set audio properties for better male voice playback
    audio.preload = 'auto'
    audio.volume = 1.0
    
    console.log(`🎙️ DeepCAL speaking with smooth male voice: ${config.voiceId} (${text.length} chars)`)
    
    // Clean up URL when audio ends
    audio.addEventListener('ended', () => {
      URL.revokeObjectURL(audioUrl)
    })
    
    // Start playback and call the callback
    try {
      await audio.play()
      onAudioReady(audio)
    } catch (playError) {
      console.error('🎤 Audio playback error:', playError)
      URL.revokeObjectURL(audioUrl)
      throw new Error('Failed to play audio. Check browser audio permissions.')
    }
  }
}
