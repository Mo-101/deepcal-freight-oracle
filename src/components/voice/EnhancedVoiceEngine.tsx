
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Brain, Waveform } from 'lucide-react';

interface VoiceEngineProps {
  onVoiceCommand: (command: string) => void;
  contextData?: any;
}

export const EnhancedVoiceEngine: React.FC<VoiceEngineProps> = ({ 
  onVoiceCommand, 
  contextData 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTone, setCurrentTone] = useState<'professional' | 'urgent' | 'casual'>('professional');
  const [audioLevel, setAudioLevel] = useState(0);
  const [lastCommand, setLastCommand] = useState<string>('');

  // Voice recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
          
        if (event.results[event.results.length - 1].isFinal) {
          setLastCommand(transcript);
          onVoiceCommand(transcript);
          processVoiceCommand(transcript);
        }
      };

      if (isListening) {
        recognition.start();
      } else {
        recognition.stop();
      }

      return () => recognition.stop();
    }
  }, [isListening, onVoiceCommand]);

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Contextual tone selection
    if (lowerCommand.includes('emergency') || lowerCommand.includes('urgent')) {
      setCurrentTone('urgent');
      speakResponse('Emergency protocol activated. Prioritizing urgent shipments.', 'urgent');
    } else if (lowerCommand.includes('status') || lowerCommand.includes('report')) {
      setCurrentTone('professional');
      generateStatusReport();
    } else if (lowerCommand.includes('hello') || lowerCommand.includes('help')) {
      setCurrentTone('casual');
      speakResponse('Hello! I\'m your DeepCAL assistant. How can I help optimize your logistics today?', 'casual');
    }
  };

  const generateStatusReport = () => {
    if (contextData) {
      const report = `Current system status: ${contextData.shipmentsCount || 0} active shipments. 
        Average delivery time is optimized. 
        No critical alerts detected.`;
      speakResponse(report, 'professional');
    }
  };

  const speakResponse = (text: string, tone: 'professional' | 'urgent' | 'casual') => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Adjust voice parameters based on tone
      switch (tone) {
        case 'urgent':
          utterance.rate = 1.2;
          utterance.pitch = 1.1;
          utterance.volume = 0.9;
          break;
        case 'casual':
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          utterance.volume = 0.8;
          break;
        default:
          utterance.rate = 1.0;
          utterance.pitch = 0.9;
          utterance.volume = 0.8;
      }
      
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  // Simulate audio level for visual feedback
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isListening]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const getToneColor = () => {
    switch (currentTone) {
      case 'urgent': return 'text-red-400';
      case 'casual': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="text-purple-400" />
          <span>Voice Command Center</span>
          <div className={`ml-auto flex items-center space-x-2 ${getToneColor()}`}>
            <span className="text-sm font-medium">{currentTone.toUpperCase()}</span>
            {isSpeaking && <Volume2 className="w-4 h-4 animate-pulse" />}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voice Waveform Visualization */}
        <div className="h-16 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
          {isListening ? (
            <div className="flex items-center space-x-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-cyan-400 rounded-full transition-all duration-100"
                  style={{ 
                    height: `${Math.max(4, (audioLevel + Math.random() * 20))}px`,
                    opacity: isListening ? 0.7 + Math.random() * 0.3 : 0.3
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-gray-500">
              <Waveform className="w-6 h-6" />
              <span className="text-sm">Voice inactive</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <Button
            onClick={toggleListening}
            className={`flex items-center space-x-2 ${
              isListening 
                ? 'bg-red-600 hover:bg-red-500' 
                : 'bg-cyan-600 hover:bg-cyan-500'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? 'Stop Listening' : 'Start Listening'}</span>
          </Button>

          <div className="flex space-x-2">
            {['professional', 'urgent', 'casual'].map((tone) => (
              <button
                key={tone}
                onClick={() => setCurrentTone(tone as any)}
                className={`px-3 py-1 rounded text-xs ${
                  currentTone === tone 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        {/* Last Command Display */}
        {lastCommand && (
          <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
            <p className="text-xs text-gray-400 mb-1">Last Command:</p>
            <p className="text-sm text-cyan-400 font-mono">"{lastCommand}"</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => processVoiceCommand('status report')}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded text-sm"
          >
            Status Report
          </button>
          <button
            onClick={() => processVoiceCommand('emergency alert')}
            className="p-2 bg-red-700 hover:bg-red-600 rounded text-sm"
          >
            Emergency Mode
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
