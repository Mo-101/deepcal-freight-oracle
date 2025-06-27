
// Display System Types - UI states and visual components

export interface MoodColors {
  primary: string;
  secondary: string;
  accent: string;
  flame: string;
}

export interface FlamePulseStatus {
  isActive: boolean;
  intensity: number;
  pattern: 'steady' | 'pulsing' | 'flickering';
}

export interface DisplayState {
  isVisible: boolean;
  animationPhase: 'enter' | 'typing' | 'complete' | 'exit';
  confidence: number;
  moodColors: MoodColors;
  flamePulse: FlamePulseStatus;
}

export interface SymbolicTheme {
  colors: MoodColors;
  typography: {
    heading: string;
    body: string;
    mono: string;
  };
  animations: {
    fadeIn: string;
    pulse: string;
    typing: string;
  };
}
