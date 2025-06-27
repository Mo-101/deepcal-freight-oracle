
import React from "react";
import { Mic, Send } from "lucide-react";

interface OracleInputFieldProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  voiceActive: boolean;
  setVoiceActive: (active: boolean) => void;
}

export const OracleInputField: React.FC<OracleInputFieldProps> = ({
  input,
  setInput,
  onSend,
  voiceActive,
  setVoiceActive
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t p-4 bg-gray-50">
      <div className="relative">
        <textarea
          rows={2}
          className="w-full px-4 py-3 pr-16 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          placeholder="Ask me about shipping routes, forwarders, or logistics..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute right-3 bottom-3 flex space-x-2">
          <button
            className={`voice-btn bg-indigo-100 text-indigo-700 p-2 rounded-full${voiceActive ? " pulsing" : ""}`}
            type="button"
            aria-label="Voice input"
            tabIndex={-1}
            onClick={() => setVoiceActive(!voiceActive)}
          >
            <Mic className="h-5 w-5" />
          </button>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full"
            type="button"
            aria-label="Send"
            onClick={onSend}
            disabled={!input.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
