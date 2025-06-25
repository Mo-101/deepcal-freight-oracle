
import React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface LocalVoiceSelectorProps {
  model: string
  gatewayUrl: string
  onModelChange: (model: string) => void
  onGatewayUrlChange: (url: string) => void
}

const localModels = [
  {
    id: "speecht5",
    name: "SpeechT5 - Natural Male (Recommended)",
    description: "Microsoft's expressive model with smooth male delivery and full text support"
  },
  {
    id: "vits", 
    name: "VITS - High Quality Male",
    description: "High-quality neural voice with natural male speech patterns"
  },
  {
    id: "fastspeech2",
    name: "FastSpeech2 - Fast Male",
    description: "Facebook's efficient model optimized for male voice clarity"
  }
]

export default function LocalVoiceSelector({ 
  model, 
  gatewayUrl, 
  onModelChange, 
  onGatewayUrlChange 
}: LocalVoiceSelectorProps) {
  return (
    <>
      <div>
        <label className="text-white text-sm font-medium mb-2 block">
          Gateway URL
        </label>
        <Input
          type="text"
          value={gatewayUrl}
          onChange={(e) => onGatewayUrlChange(e.target.value)}
          placeholder="http://localhost:8000"
          className="bg-white/10 border-white/30 text-white"
        />
        <p className="text-white/60 text-xs mt-1">
          URL of your local Hugging Face voice gateway
        </p>
      </div>

      <div>
        <label className="text-white text-sm font-medium mb-2 block">
          Male Voice Model (Optimized for Complete Text)
        </label>
        <Select value={model} onValueChange={onModelChange}>
          <SelectTrigger className="bg-white/10 border-white/30 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-white/20">
            {localModels.map((modelOption) => (
              <SelectItem key={modelOption.id} value={modelOption.id} className="text-white hover:bg-white/10">
                <div className="flex flex-col">
                  <span className="font-medium">{modelOption.name}</span>
                  <span className="text-xs text-white/70">{modelOption.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-white/60 text-xs mt-1">
          SpeechT5 recommended for natural male voice and full text synthesis
        </p>
      </div>

      <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
        <h4 className="text-green-400 font-medium mb-2 text-sm">🎙️ Male Voice Optimization Tips</h4>
        <ul className="text-white/70 text-xs space-y-1">
          <li>• Enhanced text chunking ensures complete speech output</li>
          <li>• Lower pitch settings for natural male voice delivery</li>
          <li>• SpeechT5 model provides best prosody and expression</li>
          <li>• Automatic text preprocessing removes TTS-breaking characters</li>
        </ul>
      </div>
    </>
  )
}
