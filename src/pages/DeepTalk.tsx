
import DeepCALHeader from "@/components/DeepCALHeader";
import { MessageSquareText, Sparkles } from "lucide-react";

const defaultChat = [
  {
    from: "bot",
    text: "Welcome to DeepTalk. Ask anything about your logistics decisions. (AI Tone: Smart. Tactical. Mildly Sarcastic.)",
  },
  {
    from: "user",
    text: "Which forwarder is the cheapest?",
  },
  {
    from: "bot",
    text: "According to my scientifically verifiable data (and my deep, burning desire to be accurate), 'Alpha Carrier' is the lowest cost. Their rate is so low it's either a bargain or a typo.",
  },
  {
    from: "user",
    text: "Why did Beta lose?",
  },
  {
    from: "bot",
    text: "Beta's transit times belong to a different epoch. Next question.",
  },
];

const DeepTalk = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-indigo-100 to-white">
    <DeepCALHeader />
    <main className="container max-w-2xl mx-auto pt-5">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
        <MessageSquareText className="w-7 h-7 text-yellow-500" />
        DeepTalk AI
      </h2>
      <section className="rounded-xl bg-white shadow p-6 space-y-6">
        <div className="flex flex-col gap-3">
          {defaultChat.map((line, idx) => (
            <div
              key={idx}
              className={line.from === "user"
                ? "ml-auto text-right"
                : "mr-auto text-left"}
            >
              <span className={line.from === "bot"
                ? "inline-block bg-indigo-50 text-blue-900 p-2 rounded-xl max-w-xs"
                : "inline-block bg-yellow-100 text-yellow-900 p-2 rounded-2xl max-w-xs font-mono"
              }>
                {line.text}
              </span>
            </div>
          ))}
        </div>
        <div className="flex mt-4 items-center space-x-3">
          <input className="flex-1 px-4 py-2 border border-slate-300 rounded" placeholder="Try: 'Explain the scores.'" disabled />
          <button className="px-4 py-2 bg-blue-400 text-white rounded opacity-60 cursor-not-allowed flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> Ask
          </button>
        </div>
      </section>
      <div className="text-xs text-muted-foreground pl-2 pt-2">
        “DeepTalk is under strict scientific supervision. No data, no hallucinations.”
      </div>
    </main>
  </div>
);

export default DeepTalk;
