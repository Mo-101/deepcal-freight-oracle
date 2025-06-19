
import { useState, useCallback } from 'react';
import { CalculatorInputs } from '@/types/shipment';

interface LiveQuote {
  forwarder: string;
  cost: number;
  transitDays: number;
  notes?: string;
}

export const useCalculatorInputs = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    origin: '',
    destination: '',
    weight: 0,
    volume: 0,
    cargoType: '',
    modeOfShipment: 'Air',
    priorities: {
      time: 40,
      cost: 40,
      risk: 20
    },
    selectedForwarders: []
  });

  const [liveQuotes, setLiveQuotes] = useState<LiveQuote[]>([]);
  const [validation, setValidation] = useState<{ weight?: string; volume?: string }>({});

  const resetInputs = useCallback(() => {
    setInputs({
      origin: '',
      destination: '',
      weight: 0,
      volume: 0,
      cargoType: '',
      modeOfShipment: 'Air',
      priorities: {
        time: 40,
        cost: 40,
        risk: 20
      },
      selectedForwarders: []
    });
    setLiveQuotes([]);
  }, []);

  const handlePrioritiesChange = useCallback((priorities: CalculatorInputs["priorities"]) => {
    setInputs(prev => ({ ...prev, priorities }));
  }, []);

  const handleForwarderToggle = useCallback((forwarder: string) => {
    setInputs(prev => {
      const isSelected = prev.selectedForwarders.includes(forwarder);
      const selectedForwarders = isSelected
        ? prev.selectedForwarders.filter(f => f !== forwarder)
        : [...prev.selectedForwarders, forwarder];
      
      return { ...prev, selectedForwarders };
    });
  }, []);

  return {
    inputs,
    setInputs,
    liveQuotes,
    setLiveQuotes,
    validation,
    setValidation,
    resetInputs,
    handlePrioritiesChange,
    handleForwarderToggle
  };
};
