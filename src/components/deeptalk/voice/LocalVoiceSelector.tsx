
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
    id: "vits",
    name: "VITS - Natural Male Voice",
    description: "High-quality smooth male speech synthesis"
  },
  {
    id: "speecht5", 
    name: "SpeechT5 - Expressive Male",
    description: "Microsoft's smooth expressive male model"
  },
  {
    id: "fastspeech2",
    name: "FastSpeech2 - Fast Male",
    description: "Facebook's fast and smooth male TTS model"
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
          Male TTS Model (Optimized for Smoothness)
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
      </div>
    </>
  )
}
