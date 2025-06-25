
import React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Cpu } from "lucide-react"

interface VoiceProviderSelectorProps {
  value: string
  onChange: (value: string) => void
}

export default function VoiceProviderSelector({ value, onChange }: VoiceProviderSelectorProps) {
  return (
    <div>
      <label className="text-white text-sm font-medium mb-2 block">
        Voice Provider
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-white/10 border-white/30 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-white/20">
          <SelectItem value="elevenlabs" className="text-white hover:bg-white/10">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>ElevenLabs (Cloud)</span>
            </div>
          </SelectItem>
          <SelectItem value="local" className="text-white hover:bg-white/10">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>Local Voice Gateway (Free)</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
