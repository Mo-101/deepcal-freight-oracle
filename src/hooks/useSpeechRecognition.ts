
import { useRef, useEffect, useState } from "react"

export function useSpeechRecognition() {
  const recognitionRef = useRef<any>(null)
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onerror = () => setIsListening(false)
        recognitionRef.current.onend = () => setIsListening(false)
      }
    }
  }, [])

  const startListening = (onResult: (transcript: string) => void) => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        onResult(transcript)
        setIsListening(false)
      }
      recognitionRef.current.start()
    }
  }

  return { isListening, startListening }
}
