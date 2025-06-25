
interface VoiceConfig {
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  model: 'tts-1' | 'tts-1-hd';
  speed: number; // 0.25 to 4.0
}

interface SpeechToTextResult {
  text: string;
  confidence?: number;
}

class OpenAIVoiceService {
  private apiKey: string | null = null;
  private config: VoiceConfig = {
    voice: 'onyx', // Male voice
    model: 'tts-1',
    speed: 1.0
  };

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    this.apiKey = localStorage.getItem('openai-api-key');
    const savedConfig = localStorage.getItem('openai-voice-config');
    if (savedConfig) {
      this.config = { ...this.config, ...JSON.parse(savedConfig) };
    }
  }

  updateConfig(newConfig: Partial<VoiceConfig>) {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('openai-voice-config', JSON.stringify(this.config));
    console.log('🎤 OpenAI Voice config updated:', this.config);
  }

  async textToSpeech(text: string): Promise<void> {
    if (!this.apiKey) {
      console.warn('OpenAI API key not found, falling back to browser speech');
      this.fallbackTextToSpeech(text);
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          input: text,
          voice: this.config.voice,
          speed: this.config.speed,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI TTS API error: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.play();

      console.log('🔊 OpenAI TTS playback started');
    } catch (error) {
      console.error('OpenAI TTS failed, falling back to browser speech:', error);
      this.fallbackTextToSpeech(text);
    }
  }

  private fallbackTextToSpeech(text: string) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = this.config.speed;
      utterance.pitch = 0.9; // Slightly lower for male voice
      speechSynthesis.speak(utterance);
    }
  }

  async speechToText(audioBlob: Blob): Promise<SpeechToTextResult> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key required for speech-to-text');
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');

    try {
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`OpenAI Whisper API error: ${response.status}`);
      }

      const data = await response.json();
      return { text: data.text };
    } catch (error) {
      console.error('OpenAI Speech-to-Text failed:', error);
      throw error;
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  getVoices() {
    return [
      { id: 'alloy', name: 'Alloy (Neutral)' },
      { id: 'echo', name: 'Echo (Male)' },
      { id: 'fable', name: 'Fable (British Male)' },
      { id: 'onyx', name: 'Onyx (Deep Male)' },
      { id: 'nova', name: 'Nova (Female)' },
      { id: 'shimmer', name: 'Shimmer (Female)' }
    ];
  }
}

export const openAIVoiceService = new OpenAIVoiceService();
