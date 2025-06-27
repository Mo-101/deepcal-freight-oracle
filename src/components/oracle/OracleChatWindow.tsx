
import React, { useRef, useEffect } from "react";

interface OracleMessage {
  from: "bot" | "user";
  type: string;
  text: JSX.Element;
}

interface OracleChatWindowProps {
  messages: OracleMessage[];
  isProcessing?: boolean;
}

export const OracleChatWindow: React.FC<OracleChatWindowProps> = ({
  messages,
  isProcessing = false
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
    }, 100);
  }, [messages]);

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 p-6 overflow-y-auto flex flex-col"
      id="chatContainer"
    >
      {messages.map((msg, idx) =>
        msg.from === "user" ? (
          <div key={idx} className="chat-bubble user-bubble ml-auto flex flex-row-reverse gap-3">
            <div />
            <span>{msg.text}</span>
          </div>
        ) : (
          <div key={idx} className="chat-bubble bot-bubble flex items-start space-x-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
              MO
            </div>
            <span>{msg.text}</span>
          </div>
        )
      )}
      {isProcessing && (
        <div className="chat-bubble bot-bubble flex items-start space-x-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
            MO
          </div>
          <span>Oracle engine dey think... 🤔</span>
        </div>
      )}
    </div>
  );
};
