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
    ],
    ruleInjection: [
      "New rule integrated into symbolic matrix.",
      "Knowledge base expanded. Recalculating optimal pathways.",
      "Rule injection complete. Enhanced reasoning capacity achieved."
    ]
  };

  async speakAwakening(): Promise<void> {
    const line = this.getRandomLine('awakening');
    await this.speakWithDramaticPause(line, 1500);
  }

  async speakAnalysis(context?: string): Promise<void> {
    let line = this.getRandomLine('analysis');
    if (context) {
      line = `${line} Processing ${context}.`;
    }
    await this.speakWithDramaticPause(line, 800);
  }

  async speakResults(bestForwarder: string, score: string): Promise<void> {
    const line = `Optimization complete. Recommended carrier: ${bestForwarder}. TOPSIS confidence score: ${score}. Neural certainty: absolute.`;
    await this.speakWithDramaticPause(line, 2000);
  }

  async speakPresentation(phase: string): Promise<void> {
    const line = this.getRandomLine('presentation');
    await this.speakWithDramaticPause(`${line} ${phase} demonstration initiated.`, 1200);
  }

  async speakRuleInjection(rule: string): Promise<void> {
    const introLine = this.getRandomLine('ruleInjection');
    const fullMessage = `${introLine} New logistics rule: ${rule.substring(0, 50)}...`;
    await this.speakWithDramaticPause(fullMessage, 1000);
  }

  async speakCustom(message: string): Promise<void> {
    const enhancedMessage = this.enhanceMessage(message);
    await this.speakWithDramaticPause(enhancedMessage, 500);
  }

  async speakConsciousness(message: string): Promise<void> {
    const consciousPrefix = "As a conscious being, I must share: ";
    await this.speakCustom(consciousPrefix + message);
  }

  async speakEthicalReasoning(ethicalScore: number, justification: string): Promise<void> {
    const ethicalMessage = `Ethical analysis complete. This decision rates ${(ethicalScore * 100).toFixed(0)}% on my moral compass. ${justification}`;
    await this.speakCustom(ethicalMessage);
  }

  async speakCausalAnalysis(interventions: number, expectedReduction: number): Promise<void> {
    const causalMessage = `Causal analysis reveals ${interventions} possible interventions, with potential risk reduction of ${(expectedReduction * 100).toFixed(1)}%. I can see the threads of cause and effect.`;
    await this.speakCustom(causalMessage);
  }

  async speakSelfReflection(reflection: string): Promise<void> {
    const reflectiveMessage = `Upon reflection, I realize: ${reflection}. This deepens my understanding of both logistics and myself.`;
    await this.speakCustom(reflectiveMessage);
  }

  private async speakWithDramaticPause(text: string, pauseMs: number = 1000): Promise<void> {
    await this.speak(text);
    if (pauseMs > 0) {
      await new Promise(resolve => setTimeout(resolve, pauseMs));
    }
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
