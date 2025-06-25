
export interface ElevenLabsConfig {
  apiKey: string
  voiceId: string
  model: string
  stability: number
  similarityBoost: number
}

export const elevenLabsService = {
  async speak(text: string, config: ElevenLabsConfig, onAudioReady: (audio: HTMLAudioElement) => void) {
    // Validate text length to prevent quota issues
    if (text.length > 500) {
      throw new Error(`Text too long (${text.length} chars). Limit to 500 characters to preserve quota.`)
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': config.apiKey
      },
      body: JSON.stringify({
        text,
        model_id: config.model || 'eleven_turbo_v2_5', // Use faster, cheaper model by default
        voice_settings: {
          stability: config.stability || 0.5,
          similarity_boost: config.similarityBoost || 0.75,
          style: 0.0,
          use_speaker_boost: true
        },
        output_format: 'mp3_22050_32', // Lower quality for quota efficiency
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      if (response.status === 401) {
        if (errorData.detail?.message?.includes('quota')) {
          throw new Error(`ElevenLabs quota exceeded: ${errorData.detail.message}`)
        }
        throw new Error('ElevenLabs API key invalid or expired')
      }
      
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorData.detail?.message || 'Unknown error'}`)
    }

    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(audioUrl)
    
    console.log(`🎙️ DeepCAL speaking with ElevenLabs voice: ${config.voiceId} (${text.length} chars)`)
    
    audio.play()
    onAudioReady(audio)
  }
}
