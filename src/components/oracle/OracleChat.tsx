import React, { useRef, useState } from "react";
import { Mic, Send } from "lucide-react";

type OracleMessage = {
  from: "bot" | "user";
  type: string;
  text: JSX.Element;
};

const welcomeMessages: OracleMessage[] = [
  {
    from: "bot",
    type: "welcome",
    text: (
      <>
        <p className="font-medium">Welcome to DeepCAL Oracle!</p>
        <p className="mt-1">
          I be Mo, your logistics assistant with Nigerian flavor. How I fit help you today? You wan compare forwarders or check best route?
        </p>
      </>
    ),
  },
];

const quickPrompts = [
  "Compare DHL and Kuehne & Nagel to Lagos",
  "Fastest route to Accra this week",
  "Cheapest option to Nairobi",
];

export default function OracleChat() {
  const [messages, setMessages] = useState<OracleMessage[]>(welcomeMessages);
  const [input, setInput] = useState("");
  const [voiceActive, setVoiceActive] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    // Optionally: Immediately handle send
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      { from: "user", type: "user", text: <span>{input.trim()}</span> },
      // Bot response stub for now
      { from: "bot", type: "demo", text: <span>Oracle engine dey on holiday! 😅 (This is a demo response.)</span> },
    ]);
    setInput("");
    setTimeout(() => {
      chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
    }, 100);
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
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Mo is online</span>
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
          </div>
          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-6 overflow-y-auto flex flex-col"
            id="chatContainer"
          >
            {/* Welcome Message with Quick Prompts */}
            <div className="chat-bubble bot-bubble flex items-start space-x-3 mb-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                MO
              </div>
              <div>
                <div className="font-medium">Welcome to DeepCAL Oracle!</div>
                <div className="mt-1">I be Mo, your logistics assistant with Nigerian flavor. How I fit help you today? You wan compare forwarders or check best route?</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={prompt}
                      className="quick-prompt bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-sm"
                      onClick={() => handleQuickPrompt(prompt)}
                      type="button"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* User/bot history */}
            {messages.slice(1).map((msg, idx) =>
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
          </div>
          {/* Input Area */}
          <div className="border-t p-4 bg-gray-50">
            <div className="relative">
              <textarea
                rows={2}
                className="w-full px-4 py-3 pr-16 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Ask me about shipping routes, forwarders, or logistics..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <div className="absolute right-3 bottom-3 flex space-x-2">
                <button
                  className={`voice-btn bg-indigo-100 text-indigo-700 p-2 rounded-full${voiceActive ? " pulsing" : ""}`}
                  type="button"
                  aria-label="Voice input"
                  tabIndex={-1}
                  onClick={() => setVoiceActive(v => !v)}
                >
                  <Mic className="h-5 w-5" />
                </button>
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full"
                  type="button"
                  aria-label="Send"
                  onClick={handleSend}
                  disabled={!input.trim()}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
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

// Local styles (emulating the custom chat bubble layout)
// You can move these into globals.css if you want, but for isolation they're here.
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
