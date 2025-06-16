
import { useState, useCallback } from "react"

interface ElevenLabsConfig {
  apiKey: string
  voiceId: string
  modelId: string
}

export function useEnhancedSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  // Enhanced text preprocessing for DeepCAL's sophisticated voice
  const preprocessText = (text: string): string => {
    return text
      // Remove markdown formatting but preserve structure
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/###?\s/g, "")
      .replace(/#{1,6}\s/g, "")
      
      // Clean emojis and symbols for cleaner speech
      .replace(/[🚚🚀💰🥊⏰🛡️🤔🎯📦🌍🤖👑🔥⚔️🌊⚖️👑🏆📜📊⏰🛡️🔬🧙‍♂️🎯🌟🎭✨💫🧠]/gu, "")
      .replace(/[🔊🧬🎤💬🧭⚙️🔐🛠️🔥]/gu, "")
      
      // Convert currency and numbers to natural speech
      .replace(/\$(\d{1,3}(?:,\d{3})*)/g, "$1 dollars")
      .replace(/(\d+)%/g, "$1 percent")
      .replace(/(\d+)kg/g, "$1 kilograms")
      .replace(/(\d+)\s*days?/g, "$1 days")
      
      // Expand abbreviations for clarity
      .replace(/\bDHL\b/g, "D.H.L.")
      .replace(/\bFedEx\b/g, "Fed Ex")
      .replace(/\bUPS\b/g, "U.P.S.")
      .replace(/\bTOPSIS\b/g, "TOP-SIS")
      .replace(/\bAHP\b/g, "A.H.P.")
      .replace(/\bDeepCAL\b/g, "Deep-CAL")
      
      // Add natural pauses for dramatic effect and clarity
      .replace(/\./g, ". ")
      .replace(/!/g, "! ")
      .replace(/\?/g, "? ")
      .replace(/:/g, ": ")
      .replace(/;/g, "; ")
      
      // Add pauses after section headers
      .replace(/\*\*([^*]+)\*\*/g, "$1. ")
      
      // Handle bullet points and lists
      .replace(/[-•]\s*/g, "")
      .replace(/\n\s*\n/g, ". ")
      .replace(/\n/g, " ")
      
      // Clean up extra spaces and formatting
      .replace(/\s+/g, " ")
      .replace(/\s*\.\s*\./g, ".")
      .trim()
  }

  const speakWithElevenLabs = async (text: string, config: ElevenLabsConfig) => {
    if (isSpeaking) {
      stopSpeaking()
    }

    setIsSpeaking(true)
    const processedText = preprocessText(text)
    
    // Chunk long text to avoid API limits while preserving narrative flow
    const chunks = chunkTextIntelligently(processedText, 2500)
    
    try {
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
        setAudioElement(audio)
        
        // Set up event handlers
        audio.onended = () => {
          if (i === chunks.length - 1) { // Last chunk
            setIsSpeaking(false)
            setAudioElement(null)
          }
          URL.revokeObjectURL(audioUrl)
        }
        
        audio.onerror = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
          setAudioElement(null)
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
      
    } catch (error) {
      console.error("ElevenLabs speech error:", error)
      setIsSpeaking(false)
      // Fallback to browser TTS
      fallbackToSystemTTS(processedText)
    }
  }

  // Intelligent text chunking that preserves narrative flow
  const chunkTextIntelligently = (text: string, maxLength: number): string[] => {
    if (text.length <= maxLength) return [text]
    
    const chunks: string[] = []
    let currentChunk = ""
    
    // Split by sentences to maintain natural flow
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
    
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length <= maxLength) {
        currentChunk += sentence
      } else {
        if (currentChunk) {
          chunks.push(currentChunk.trim())
          currentChunk = sentence
        } else {
          // Sentence is too long, split by words
          const words = sentence.split(' ')
          let wordChunk = ""
          for (const word of words) {
            if (wordChunk.length + word.length + 1 <= maxLength) {
              wordChunk += (wordChunk ? ' ' : '') + word
            } else {
              if (wordChunk) chunks.push(wordChunk)
              wordChunk = word
            }
          }
          if (wordChunk) currentChunk = wordChunk
        }
      }
    }
    
    if (currentChunk) chunks.push(currentChunk.trim())
    return chunks
  }

  const fallbackToSystemTTS = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9        // Slightly slower for clarity
      utterance.pitch = 0.7       // Lower pitch for authority
      utterance.volume = 0.9

      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find((voice) => 
        voice.lang.includes("en") && 
        (voice.name.toLowerCase().includes("male") || 
         voice.name.toLowerCase().includes("david") || 
         voice.name.toLowerCase().includes("daniel") ||
         voice.name.toLowerCase().includes("alex") ||
         voice.name.toLowerCase().includes("george"))
      ) || voices.find((voice) => voice.lang.includes("en")) || voices[0]

      if (preferredVoice) utterance.voice = preferredVoice
      
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      window.speechSynthesis.speak(utterance)
      console.log("DeepCAL speaking with enhanced fallback voice:", preferredVoice?.name || "default")
    }
  }

  const stopSpeaking = () => {
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
      setAudioElement(null)
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }

  const speakText = useCallback((text: string, elevenLabsConfig?: ElevenLabsConfig) => {
    if (elevenLabsConfig) {
      speakWithElevenLabs(text, elevenLabsConfig)
    } else {
      const processedText = preprocessText(text)
      fallbackToSystemTTS(processedText)
    }
  }, [audioElement, isSpeaking])

  return {
    speakText,
    isSpeaking,
    stopSpeaking
  }
}
