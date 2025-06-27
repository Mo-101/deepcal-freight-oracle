
import React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ElevenLabsVoiceSelectorProps {
  value: string
  onChange: (value: string) => void
}

const maleVoiceOptions = [
  { 
    id: "onwK4e9ZLuTAKqWW03F9", 
    name: "Daniel - Professional Oracle", 
    description: "Smooth, professional male voice for logistics analysis",
    region: "Global"
  },
  { 
    id: "JBFqnCBsd6RMkjVDRZzb", 
    name: "George - Deep Authority", 
    description: "Deep, smooth authoritative male voice",
    region: "Global" 
  },
  { 
    id: "TX3LPaxmHKxFdv7VOQHJ", 
    name: "Liam - Quick Analyst", 
    description: "Clear, energetic male voice for rapid analysis",
    region: "Global"
  },
  { 
    id: "bIHbv24MWmeRgasZH58o", 
    name: "Will - Enthusiastic Guide", 
    description: "Dynamic male voice with smooth delivery",
    region: "Global"
  },
  { 
    id: "cjVigY5qzO86Huf0OWal", 
    name: "Eric - African Professional", 
    description: "Smooth African male voice with professional tone",
    region: "African"
  },
  { 
    id: "nPczCjzI2devNBz1zQrb", 
    name: "Brian - African Narrator", 
    description: "Rich, smooth African male storytelling voice",
    region: "African"
  }
]

export default function ElevenLabsVoiceSelector({ value, onChange }: ElevenLabsVoiceSelectorProps) {
  return (
    <div>
      <label className="text-white text-sm font-medium mb-2 block">
        Male Voice Personality (Optimized for Smoothness)
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-white/10 border-white/30 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-white/20">
          {maleVoiceOptions.map((voice) => (
            <SelectItem key={voice.id} value={voice.id} className="text-white hover:bg-white/10">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{voice.name}</span>
                  {voice.region === "African" && (
                    <span className="text-xs bg-orange-600 px-2 py-0.5 rounded text-white">
                      🌍 African
                    </span>
                  )}
                </div>
                <span className="text-xs text-white/70">{voice.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
