
import React from "react";

interface OracleResponseBubbleProps {
  message: JSX.Element;
  isWelcome?: boolean;
  quickPrompts?: string[];
  onQuickPrompt?: (prompt: string) => void;
}

export const OracleResponseBubble: React.FC<OracleResponseBubbleProps> = ({
  message,
  isWelcome = false,
  quickPrompts = [],
  onQuickPrompt
}) => {
  return (
    <div className="chat-bubble bot-bubble flex items-start space-x-3 mb-2">
      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
        MO
      </div>
      <div>
        {message}
        {isWelcome && quickPrompts.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                className="quick-prompt bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-sm"
                onClick={() => onQuickPrompt?.(prompt)}
                type="button"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
