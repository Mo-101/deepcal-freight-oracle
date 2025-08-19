import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, MicOff, Loader2 } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  onSubmit: () => void;
  onStartListening?: () => void;
  isProcessing?: boolean;
  isListening?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  input,
  setInput,
  onSubmit,
  onStartListening,
  isProcessing = false,
  isListening = false,
  disabled = false,
  placeholder = "Ask DeepCAL anything about freight optimization..."
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing && !disabled) {
      onSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canSubmit = input.trim() && !isProcessing && !disabled;

  return (
    <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="p-4">
        <div className={`relative flex items-end gap-2 rounded-lg border transition-colors ${
          isFocused 
            ? 'border-lime-400/50 bg-white/10' 
            : 'border-white/20 bg-white/5'
        }`}>
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled || isProcessing}
              className="min-h-[44px] max-h-32 resize-none border-0 bg-transparent text-white placeholder:text-indigo-300 focus-visible:ring-0 focus-visible:ring-offset-0 pr-12"
              rows={1}
            />
            
            {/* Character count indicator */}
            {input.length > 0 && (
              <div className="absolute bottom-2 right-2 text-xs text-indigo-400">
                {input.length}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 p-2">
            {/* Voice input button */}
            {onStartListening && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onStartListening}
                disabled={disabled || isProcessing}
                className={`h-8 w-8 p-0 ${
                  isListening 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                    : 'text-indigo-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* Send button */}
            <Button
              type="submit"
              size="sm"
              disabled={!canSubmit}
              className={`h-8 w-8 p-0 ${
                canSubmit
                  ? 'bg-lime-500 hover:bg-lime-600 text-black'
                  : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex items-center justify-between mt-2 text-xs">
          <div className="flex items-center gap-2 text-indigo-300">
            {isListening && (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                Listening...
              </span>
            )}
            {isProcessing && (
              <span className="flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Processing...
              </span>
            )}
          </div>
          
          <div className="text-indigo-400">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </form>
    </div>
  );
}