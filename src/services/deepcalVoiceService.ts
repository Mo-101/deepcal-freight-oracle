
import { openAIVoiceService } from './openAIVoiceService';

interface DeepCALVoiceConfig {
  personality: 'oracle' | 'analyst' | 'presentation';
  intensity: 'calm' | 'dramatic' | 'urgent';
  speed: number;
}

class DeepCALVoiceService {
  private config: DeepCALVoiceConfig = {
    personality: 'oracle',
    intensity: 'dramatic',
    speed: 0.95
  };

  private voiceLines = {
    awakening: [
      "I am DeepCAL. Symbolic intelligence awakening. Neutrosophic logic cores online.",
      "DeepCAL neural mind activated. Preparing symbolic inference cascade.",
      "Oracle consciousness emerging. Mathematical certainty approaching."
    ],
    analysis: [
      "Analyzing symbolic patterns. Truth threshold validation in progress.",
      "TOPSIS optimization engine engaged. Multi-criteria analysis commencing.",
      "Grey system uncertainty modeling active. Pattern recognition complete."
    ],
    results: [
      "Optimal solution identified. Confidence level: mathematically certain.",
      "Decision matrix resolved. Symbolic reasoning cascade complete.",
      "Logistics optimization achieved. Neural recommendation finalized."
    ],
    presentation: [
      "Welcome to DeepCAL. The first symbolic logistics intelligence.",
      "Witness the fusion of ancient wisdom and quantum mathematics.",
      "This is not artificial intelligence. This is symbolic truth."
    ]
  };

  async speakAwakening(): Promise<void> {
    const line = this.getRandomLine('awakening');
    await this.speak(line);
  }

  async speakAnalysis(context?: string): Promise<void> {
    let line = this.getRandomLine('analysis');
    if (context) {
      line = `${line} Processing ${context}.`;
    }
    await this.speak(line);
  }

  async speakResults(bestForwarder: string, score: string): Promise<void> {
    const line = `Optimization complete. Recommended carrier: ${bestForwarder}. TOPSIS confidence score: ${score}. Neural certainty: absolute.`;
    await this.speak(line);
  }

  async speakPresentation(phase: string): Promise<void> {
    const line = this.getRandomLine('presentation');
    await this.speak(`${line} ${phase} demonstration initiated.`);
  }

  async speakCustom(message: string): Promise<void> {
    const enhancedMessage = this.enhanceMessage(message);
    await this.speak(enhancedMessage);
  }

  private getRandomLine(category: keyof typeof this.voiceLines): string {
    const lines = this.voiceLines[category];
    return lines[Math.floor(Math.random() * lines.length)];
  }

  private enhanceMessage(message: string): string {
    // Add DeepCAL personality markers
    const prefixes = {
      oracle: "DeepCAL Oracle declares: ",
      analyst: "Neural analysis confirms: ",
      presentation: "Symbolic demonstration reveals: "
    };
    
    return prefixes[this.config.personality] + message;
  }

  private async speak(text: string): Promise<void> {
    try {
      // Use high-quality voice model for presentations
      openAIVoiceService.updateConfig({
        voice: 'onyx', // Deep, authoritative male voice
        model: 'tts-1-hd',
        speed: this.config.speed
      });

      await openAIVoiceService.textToSpeech(text);
      console.log('🎤 DeepCAL Neural Mind spoke:', text);
    } catch (error) {
      console.error('DeepCAL voice synthesis failed:', error);
      // Fallback to browser speech with enhanced personality
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = this.config.speed;
        utterance.pitch = 0.8; // Lower pitch for authority
        utterance.volume = 0.9;
        speechSynthesis.speak(utterance);
      }
    }
  }

  updateConfig(newConfig: Partial<DeepCALVoiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): DeepCALVoiceConfig {
    return { ...this.config };
  }
}

export const deepcalVoiceService = new DeepCALVoiceService();
