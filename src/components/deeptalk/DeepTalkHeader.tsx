
import React from "react"
import { Button } from "@/components/ui/button"
import { Settings, Brain } from "lucide-react"

interface DeepTalkHeaderProps {
  groqConfigured: boolean
  currentProvider: string | null
  onShowGroqConfig: () => void
  onShowVoiceConfig: () => void
}

export default function DeepTalkHeader({
  groqConfigured,
  currentProvider,
  onShowGroqConfig,
  onShowVoiceConfig,
}: DeepTalkHeaderProps) {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-slate-800/50 border-b border-white/10">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-white">DeepTalk AI Assistant</h1>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
          <span className="text-sm text-indigo-200">DeepCAL Oracle Active</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={onShowGroqConfig}
          variant="outline"
          size="sm"
          className={`border-white/30 text-white hover:bg-white/10 ${groqConfigured ? 'border-purple-400/50 bg-purple-900/20' : ''}`}
        >
          <Brain className="w-4 h-4 mr-2" />
          {groqConfigured ? 'AI Brain' : 'Enable AI'}
        </Button>
        <Button
          onClick={onShowVoiceConfig}
          variant="outline"
          size="sm"
          className={`border-white/30 text-white hover:bg-white/10 ${currentProvider ? 'border-green-400/50 bg-green-900/20' : ''}`}
        >
          <Settings className="w-4 h-4 mr-2" />
          {currentProvider ? `Voice: ${currentProvider}` : 'Voice'}
        </Button>
      </div>
    </div>
  )
}
