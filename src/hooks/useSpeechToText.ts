
import { useState, useCallback } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';

export const useSpeechToText = () => {
  const [transcript, setTranscript] = useState('');
  const { isListening, startListening } = useSpeechRecognition();

  const handleStartListening = useCallback(() => {
    startListening((result: string) => {
      setTranscript(result);
    });
  }, [startListening]);

  const stopListening = useCallback(() => {
    // Speech recognition will stop automatically when result is received
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    startListening: handleStartListening,
    stopListening,
    resetTranscript
  };
};
