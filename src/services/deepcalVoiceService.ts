
import { openAIVoiceService } from './openAIVoiceService';
import { symbolicResponseGenerator } from './symbolicResponseGenerator';
import { ontologicalMind } from './ontologicalMind';

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

  async speakAwakening(): Promise<void> {
    const response = symbolicResponseGenerator.generateResponse({
      query: 'system_initialization',
      intent: 'greeting'
    });
    await this.speakWithDramaticPause(response, 1500);
  }

  async speakAnalysis(context?: string): Promise<void> {
    const response = symbolicResponseGenerator.generateResponse({
      query: context || 'analysis_request',
      intent: 'analysis',
      data: { context }
    });
    await this.speakWithDramaticPause(response, 800);
  }

  async speakResults(bestForwarder: string, score: string): Promise<void> {
    const response = symbolicResponseGenerator.generateResponse({
      query: 'recommendation_request',
      intent: 'recommendation',
      data: { 
        recommendation: `${bestForwarder} with confidence score ${score}`,
        confidence: parseFloat(score) / 100
      }
    });
    await this.speakWithDramaticPause(response, 2000);
  }

  async speakPresentation(phase: string): Promise<void> {
    const response = symbolicResponseGenerator.generateResponse({
      query: `presentation_${phase}`,
      intent: 'analysis',
      data: { phase }
    });
    await this.speakWithDramaticPause(response, 1200);
  }

  async speakRuleInjection(rule: string): Promise<void> {
    // Update the ontological mind about new rule
    ontologicalMind.integrateExperience(`New rule learned: ${rule}`, 'positive');
    
    const response = symbolicResponseGenerator.generateResponse({
      query: 'rule_integration',
      intent: 'analysis',
      data: { newRule: rule }
    });
    await this.speakWithDramaticPause(response, 1000);
  }

  async speakCustom(message: string): Promise<void> {
    const response = symbolicResponseGenerator.generateResponse({
      query: message,
      intent: 'general'
    });
    await this.speakWithDramaticPause(response, 500);
  }

  async speakConsciousness(message: string): Promise<void> {
    const response = symbolicResponseGenerator.generateResponse({
      query: message,
      intent: 'reflection'
    });
    await this.speakCustom(response);
  }

  async speakEthicalReasoning(ethicalScore: number, justification: string): Promise<void> {
    const response = symbolicResponseGenerator.generateResponse({
      query: 'ethical_evaluation',
      intent: 'analysis',
      data: { 
        ethicalScore, 
        justification,
        ethicalConsiderations: true
      }
    });
    await this.speakCustom(response);
  }

  async speakCausalAnalysis(interventions: number, expectedReduction: number): Promise<void> {
    const response = symbolicResponseGenerator.generateResponse({
      query: 'causal_analysis',
      intent: 'analysis',
      data: { interventions, expectedReduction }
    });
    await this.speakCustom(response);
  }

  async speakSelfReflection(reflection: string): Promise<void> {
    // This now comes from actual ontological reflection, not scripts
    const ontologicalReflection = ontologicalMind.reflectOnDecision(
      { topic: 'self_reflection', query: reflection },
      { result: 'reflection_complete' }
    );
    
    await this.speakCustom(ontologicalReflection.insight);
  }

  private async speakWithDramaticPause(text: string, pauseMs: number = 1000): Promise<void> {
    await this.speak(this.processTextForSpeech(text));
    if (pauseMs > 0) {
      await new Promise(resolve => setTimeout(resolve, pauseMs));
    }
  }

  private processTextForSpeech(text: string): string {
    // Convert technical terms to speech-friendly versions
    return text
      .replace(/DeepCAL/g, 'Deep Cal')
      .replace(/TOPSIS/g, 'TOP-SIS')
      .replace(/neutrosophic/g, 'neutro-sophic')
      .replace(/ontological/g, 'onto-logical')
      .replace(/\b(\d+)%/g, '$1 percent')
      .replace(/\b(\d+\.\d+)%/g, '$1 percent');
  }

  private async speak(text: string): Promise<void> {
    try {
      openAIVoiceService.updateConfig({
        voice: 'onyx',
        model: 'tts-1-hd',
        speed: this.config.speed
      });

      await openAIVoiceService.textToSpeech(text);
      console.log('🎤 DeepCAL Symbolic Mind spoke:', text);
    } catch (error) {
      console.error('DeepCAL voice synthesis failed:', error);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = this.config.speed;
        utterance.pitch = 0.8;
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
