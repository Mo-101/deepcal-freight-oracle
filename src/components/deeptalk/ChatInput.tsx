
import React from "react"
import { Button } from "@/components/ui/button"
import { Mic, Send } from "lucide-react"

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onStartListening: () => void
  isProcessing: boolean
  isListening: boolean
}

export default function ChatInput({
  input,
  setInput,
  onSubmit,
  onStartListening,
  isProcessing,
  isListening,
}: ChatInputProps) {
  return (
    <div className="border-t border-white/20 p-4 bg-slate-800/30">
      <form onSubmit={onSubmit} className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about routes, costs, timing, or anything logistics..."
          className="flex-1 px-4 py-3 pr-16 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent resize-none bg-slate-800/50 text-white placeholder-indigo-300"
          rows={2}
          disabled={isProcessing}
        />
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            onClick={onStartListening}
            disabled={isListening || isProcessing}
            className="bg-lime-400/20 text-lime-400 p-2 rounded-full border border-lime-400/30 hover:bg-lime-400/30"
          >
            <Mic className={`w-5 h-5 ${isListening ? "animate-pulse" : ""}`} />
          </Button>
          <Button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="bg-lime-400 hover:bg-lime-500 text-slate-900 p-2 rounded-full"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
