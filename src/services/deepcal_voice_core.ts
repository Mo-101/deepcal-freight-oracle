
import axios from 'axios';

export const speak = async (text: string, voice: "nova" | "shimmer" = "nova") => {
  try {
    const apiKey = localStorage.getItem("openai-api-key");
    if (!apiKey) {
      console.warn("No OpenAI API key found - voice disabled");
      return;
    }

    const res = await axios.post("https://api.openai.com/v1/audio/speech", {
      model: "tts-1-hd",
      input: processTextForSpeech(text),
      voice
    }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      responseType: "arraybuffer"
    });

    const audio = new Blob([res.data], { type: "audio/mpeg" });
    const url = URL.createObjectURL(audio);
    const audioElement = new Audio(url);
    
    await audioElement.play();
    
    // Clean up the URL after playing
    audioElement.addEventListener('ended', () => {
      URL.revokeObjectURL(url);
    });
    
  } catch (error) {
    console.error("Voice synthesis failed:", error);
    // Fallback to browser speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(processTextForSpeech(text));
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      speechSynthesis.speak(utterance);
    }
  }
};

const processTextForSpeech = (text: string): string => {
  return text
    .replace(/DeepCAL/g, 'Deep Cal')
    .replace(/TOPSIS/g, 'TOP-SIS')
    .replace(/neutrosophic/g, 'neutro-sophic')
    .replace(/ontological/g, 'onto-logical')
    .replace(/\b(\d+)%/g, '$1 percent')
    .replace(/\b(\d+\.\d+)%/g, '$1 percent')
    .replace(/🧠|🔥|⚡|🎯/g, ''); // Remove emojis for cleaner speech
};

export const generateNarration = (result: any): string => {
  const { decision, score, causes, ethics } = result;
  const ethicalScore = (ethics * 100).toFixed(1);
  const confidence = (score * 100).toFixed(1);
  return `
    Decision rendered.
    Chosen route: ${decision}.
    Justified by ${causes.length} causal chains.
    Ethics compliance: ${ethicalScore}%.
    Confidence level: ${confidence}%.
  `;
};

export const handleDecisionVoice = (result: any) => {
  const message = generateNarration(result);
  speak(message, "nova");
};

export const handleRuleRejection = (rule: any) => {
  const { condition, values } = rule;
  const message = `Rule rejected: '${condition}'. Truth: ${(values.truth * 100).toFixed(1)}%, Indeterminacy: ${(values.indeterminacy * 100).toFixed(1)}%, Falsity: ${(values.falsity * 100).toFixed(1)}%.`;
  speak(message, "nova");
};

export const handleLowConfidence = () => {
  const message = "No valid decision available. All options fall below logical or ethical confidence thresholds.";
  speak(message, "shimmer");
};
