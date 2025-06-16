
import { chunkTextIntelligently } from '@/utils/textChunker'

export interface ElevenLabsConfig {
  apiKey: string
  voiceId: string
  modelId: string
}

export interface ElevenLabsService {
  speak: (text: string, config: ElevenLabsConfig, onAudioReady: (audio: HTMLAudioElement) => void) => Promise<void>
}

export const elevenLabsService: ElevenLabsService = {
  async speak(text: string, config: ElevenLabsConfig, onAudioReady: (audio: HTMLAudioElement) => void) {
    // Chunk long text to avoid API limits while preserving narrative flow
    const chunks = chunkTextIntelligently(text, 2500)
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`, {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": config.apiKey,
        },
        body: JSON.stringify({
          text: chunk,
          model_id: config.modelId,
          voice_settings: {
            stability: 0.6,        // Slightly more stable for narration
            similarity_boost: 0.8, // Higher similarity for consistency
            style: 0.4,           // Moderate style for engaging delivery
            use_speaker_boost: true
          }
        }),
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      const audio = new Audio(audioUrl)
      onAudioReady(audio)
      
      // Set up cleanup
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
      }
      
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl)
      }

      await audio.play()
      
      // Wait for audio to finish before starting next chunk
      if (i < chunks.length - 1) {
        await new Promise(resolve => {
          audio.onended = resolve
        })
      }
    }
    
    console.log("DeepCAL speaking with enhanced ElevenLabs voice:", config.voiceId)
  }
}
