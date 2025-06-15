import React, { useRef } from "react";
import DeepCALHeader from "@/components/DeepCALHeader";

const INITIAL_MESSAGES = [
  {
    from: "bot",
    text: (
      <>
        <span className="font-medium">Welcome to DeepTalk <span className="text-indigo-600">AI</span>!</span>
        <span className="block mt-1 text-indigo-900">
          Ask anything on logistics strategy, route scores, or how the engine thinks. (AI Tone: <span className="italic text-yellow-700">Smart. Tactical. Mildly Sarcastic.</span>)
        </span>
      </>
    ),
  },
  {
    from: "user",
    text: "Which forwarder is the cheapest?",
  },
  {
    from: "bot",
    text: (
      <>
        <span>
          According to my scientifically verifiable data (and my deep, burning desire to be accurate),
          <span className="font-bold text-indigo-600"> 'Alpha Carrier'</span> is the lowest cost.
        </span>
        <span className="block">
          Their rate is so low it's either a bargain or a typo.
        </span>
      </>
    ),
  },
  {
    from: "user",
    text: "Why did Beta lose?",
  },
  {
    from: "bot",
    text: (
      <>
        <span>
          Beta's transit times belong to a different epoch.
        </span>
        <span className="block">
          Next question.
        </span>
      </>
    ),
  },
];

const QUICK_PROMPTS = [
  "Explain the score math",
  "Show me shipment outliers",
  "Why did Alpha win?",
];

const DeepTalkChat = () => {
  const chatRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen flex flex-col" style={{
      fontFamily: "'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'",
      backgroundColor: "#F3F4F6"
    }}>
      {/* Top nav - unified */}
      <DeepCALHeader />

      {/* Main area */}
      <main className="flex-1 container mx-auto py-8 px-2 sm:px-6 flex flex-col md:flex-row gap-6">
        {/* Chat Card */}
        <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden flex flex-col oracle-card">
          {/* Chat Title */}
          <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Logistics Decision Chat
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">AI is online</span>
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
          </div>
          {/* Chat Conversation */}
          <div ref={chatRef} className="flex-1 p-6 overflow-y-auto flex flex-col" id="chatContainer">
            {/* Welcome and initial messages */}
            <div className="chat-bubble bot-bubble flex items-start space-x-3 mb-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                DT
              </div>
              <div>
                <div className="font-medium">Welcome to DeepTalk <span className="text-indigo-600">AI</span>!</div>
                <div className="mt-1 text-indigo-900">
                  Ask about engine math, outliers, or why a route won or lost. <br />
                  <span className="italic text-slate-400">Example questions:</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={prompt}
                      className="quick-prompt bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-sm"
                      type="button"
                      tabIndex={-1}
                      disabled
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Show message history in styled bubbles */}
            <div className="flex flex-col gap-2">
              {INITIAL_MESSAGES.map((msg, idx) =>
                msg.from === "user" ? (
                  <div key={idx} className="chat-bubble user-bubble ml-auto flex flex-row-reverse gap-3">
                    <div />
                    <span>{msg.text}</span>
                  </div>
                ) : (
                  <div key={idx} className="chat-bubble bot-bubble flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                      DT
                    </div>
                    <div>{msg.text}</div>
                  </div>
                )
              )}
            </div>
          </div>
          {/* Input area - disabled for now */}
          <div className="border-t p-4 bg-gray-50">
            <div className="relative">
              <textarea
                rows={2}
                className="w-full px-4 py-3 pr-16 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-slate-50"
                placeholder="AI is read-only for now. Try a sample question above!"
                disabled
              />
              <div className="absolute right-3 bottom-3 flex space-x-2">
                <button
                  className="voice-btn bg-indigo-100 text-indigo-700 p-2 rounded-full"
                  type="button"
                  aria-label="Voice input"
                  tabIndex={-1}
                  disabled
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full"
                  type="button"
                  aria-label="Send"
                  disabled
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Analytics panel placeholder (right column) */}
        <aside className="w-full md:w-96 bg-white rounded-xl shadow-md overflow-hidden flex flex-col" style={{ minHeight: "585px" }}>
          <div className="bg-gray-50 px-6 py-4 border-b">
            <span className="font-semibold text-gray-700">Panel (Coming soon): Score formulas, route analytics, explainers…</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 px-6">
            <span>Deep analysis tied to your real shipments—coming soon.</span>
          </div>
        </aside>
      </main>
      {/* Inline styles for chat bubbles, like your Oracle HTML */}
      <style>
        {`
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
        .oracle-card {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.07) 0%, rgba(15, 23, 42, 0.09) 100%);
        }
        .voice-btn {
          transition: all 0.2s;
        }
        .voice-btn:active, .voice-btn:focus {
          transform: scale(1.08);
        }
        `}
      </style>
    </div>
  );
};

export default DeepTalkChat;
