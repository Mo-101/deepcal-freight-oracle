
// Voice System Types - Voice triggers and scripts

export interface VoiceTrigger {
  id: string;
  trigger: 'onAwakening' | 'onAnalysis' | 'onComplete' | 'onError';
  message: string;
  voice: 'nova' | 'alloy' | 'echo';
  priority: 'high' | 'medium' | 'low';
}

export interface VoiceScript {
  context: string;
  narration: string;
  timing: number;
  shouldSpeak: boolean;
}

export interface VoiceMood {
  tone: 'confident' | 'analytical' | 'mystical' | 'warning';
  intensity: number;
  duration: number;
}
