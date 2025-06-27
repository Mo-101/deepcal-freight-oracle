
import React, { useState } from 'react';
import { speak } from '@/services/deepcal_voice_core';
import { Volume2, VolumeX, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeepTalkVoiceProps {
  message: string;
}

const DeepTalkVoice: React.FC<DeepTalkVoiceProps> = ({ message }) => {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [status, setStatus] = useState<'idle' | 'speaking'>('idle');

  const handleSpeak = async () => {
    if (!voiceEnabled || !message) return;
    setStatus('speaking');
    try {
      await speak(message, "nova");
    } catch (error) {
      console.error('Speech failed:', error);
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => setVoiceEnabled(v => !v)}
        variant="outline"
        size="sm"
        className={`transition-colors ${
          voiceEnabled 
            ? 'border-green-400/50 bg-green-900/20 text-green-300 hover:bg-green-800/30' 
            : 'border-gray-400/50 bg-gray-900/20 text-gray-400 hover:bg-gray-800/30'
        }`}
      >
        {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </Button>

      <Button
        onClick={handleSpeak}
        disabled={!voiceEnabled || !message || status === 'speaking'}
        variant="outline"
        size="sm"
        className="border-blue-400/50 bg-blue-900/20 text-blue-300 hover:bg-blue-800/30 disabled:opacity-50"
      >
        <Play className="w-3 h-3 mr-1" />
        {status === 'speaking' ? 'Speaking...' : 'Speak'}
      </Button>
    </div>
  );
};

export default DeepTalkVoice;
