
export interface ElevenLabsConfig {
  apiKey: string
  voiceId: string
  model: string
  stability: number
  similarityBoost: number
}

export const elevenLabsService = {
  async speak(text: string, config: ElevenLabsConfig, onAudioReady: (audio: HTMLAudioElement) => void) {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': config.apiKey
      },
      body: JSON.stringify({
        text,
        model_id: config.model,
        voice_settings: {
          stability: config.stability,
          similarity_boost: config.similarityBoost
        }
      })
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(audioUrl)
    
    console.log(`DeepCAL speaking with enhanced ElevenLabs voice: ${config.voiceId}`)
    
    audio.play()
    onAudioReady(audio)
  }
}
