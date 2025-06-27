
import React, { useState } from "react";
import { Mic } from "lucide-react";
import { OracleChatWindow } from "./OracleChatWindow";
import { OracleInputField } from "./OracleInputField";
import { OracleResponseBubble } from "./OracleResponseBubble";
import { OracleMoodPulse } from "./OracleMoodPulse";

type OracleMessage = {
  from: "bot" | "user";
  type: string;
  text: JSX.Element;
};

const welcomeMessage = (
  <>
    <p className="font-medium">Welcome to DeepCAL Oracle!</p>
    <p className="mt-1">
      I be Mo, your logistics assistant with Nigerian flavor. How I fit help you today? You wan compare forwarders or check best route?
    </p>
  </>
);

const quickPrompts = [
  "Compare DHL and Kuehne & Nagel to Lagos",
  "Fastest route to Accra this week",
  "Cheapest option to Nairobi",
];

export default function OracleChat() {
  const [messages, setMessages] = useState<OracleMessage[]>([]);
  const [input, setInput] = useState("");
  const [voiceActive, setVoiceActive] = useState(false);

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      { from: "user", type: "user", text: <span>{input.trim()}</span> },
      { from: "bot", type: "demo", text: <span>Oracle engine dey on holiday! 😅 (This is a demo response.)</span> },
    ]);
    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-blue-50 to-white font-elegant" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
      {/* Header */}
      <header className="bg-indigo-600 text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xl">
              MO
            </div>
            <h1 className="text-xl font-bold">DeepCAL Oracle</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className={`bg-white text-indigo-600 px-4 py-2 rounded-full font-medium flex items-center space-x-2 ${voiceActive ? "ring-2 ring-green-400" : ""}`}
              onClick={() => setVoiceActive(v => !v)}
              type="button"
            >
              <Mic className="w-5 h-5" />
              <span>Voice {voiceActive ? "ON" : "OFF"}</span>
            </button>
            <button className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-full font-medium" type="button">
              Settings
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto py-6 px-2 sm:px-4 flex flex-col md:flex-row gap-6">
        {/* Chat Interface */}
        <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
          {/* Chat Header */}
          <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Logistics Assistant</h2>
            <OracleMoodPulse isActive={true} mood="confident" />
          </div>

          {/* Welcome Message */}
          <div className="p-6 border-b">
            <OracleResponseBubble
              message={welcomeMessage}
              isWelcome={true}
              quickPrompts={quickPrompts}
              onQuickPrompt={handleQuickPrompt}
            />
          </div>

          {/* Chat Messages */}
          <OracleChatWindow messages={messages} />

          {/* Input Area */}
          <OracleInputField
            input={input}
            setInput={setInput}
            onSend={handleSend}
            voiceActive={voiceActive}
            setVoiceActive={setVoiceActive}
          />
        </div>

        {/* Analysis panel placeholder */}
        <aside className="w-full md:w-96 bg-white rounded-xl shadow-md overflow-hidden flex flex-col" style={{ minHeight: "585px" }}>
          <div className="bg-gray-50 px-6 py-4 border-b">
            <span className="font-semibold text-gray-700">Panel (Coming soon): Analytics, route detail, forecast...</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 px-6">
            <span>Plug in DeepCAL engine APIs for decision intelligence and shipment analytics.</span>
          </div>
        </aside>
      </main>
    </div>
  );
}

// Local styles preserved for backwards compatibility
if (typeof window !== "undefined") {
  const s = document.createElement("style");
  s.innerHTML = `
    .chat-bubble {
      max-width: 80%;
      border-radius: 1.5rem;
      padding: 1rem 1.5rem;
      margin-bottom: 1rem;
      position: relative;
    }
    .user-bubble {
      background-color: #4F46E5;
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 0.5rem;
    }
    .bot-bubble {
      background-color: white;
      color: #1F2937;
      align-self: flex-start;
      border-bottom-left-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
    }
    .voice-btn.pulsing {
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(1);}
      50% { transform: scale(1.1);}
      100% { transform: scale(1);}
    }
  `;
  document.head.appendChild(s);
}
