
import React from "react"
import { Button } from "@/components/ui/button"
import { Settings, Brain, Zap } from "lucide-react"

interface DeepTalkHeaderProps {
  trainingBufferStatus: { count: number; maxSize: number }
  onShowVoiceConfig: () => void
}

export default function DeepTalkHeader({ trainingBufferStatus, onShowVoiceConfig }: DeepTalkHeaderProps) {
  return (
    <div className="flex justify-between items-center w-full lg:hidden mb-4">
      <h1 className="text-2xl font-bold text-white">DeepTalk AI</h1>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-purple-400/50 bg-purple-900/20 text-purple-300 hover:bg-purple-800/30"
          disabled
        >
          <Brain className="w-4 h-4 mr-2" />
          AI Brain Active
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-yellow-400/50 bg-yellow-900/20 text-yellow-300 hover:bg-yellow-800/30"
          disabled
        >
          <Zap className="w-4 h-4 mr-2" />
          Training: {trainingBufferStatus.count}/{trainingBufferStatus.maxSize}
        </Button>
        <Button
          onClick={onShowVoiceConfig}
          variant="outline"
          size="sm"
          className="border-white/30 text-white hover:bg-white/10"
        >
          <Settings className="w-4 h-4 mr-2" />
          Voice
        </Button>
      </div>
    </div>
  )
}
