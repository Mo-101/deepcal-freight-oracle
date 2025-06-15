
import { useState } from 'react';
import { CalculatorInputs } from '@/types/shipment';

const DEFAULT_INPUTS: CalculatorInputs = {
  origin: '',
  destination: '',
  weight: 0,
  volume: 0,
  cargoType: 'Emergency Health Kits',
  priorities: {
    time: 33,
    cost: 33,
    risk: 34
  },
  selectedForwarders: []
};

export const useCalculatorInputs = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [validation, setValidation] = useState<{weight?: string; volume?: string}>({});

  const resetInputs = () => {
    setInputs(DEFAULT_INPUTS);
  };

  const handlePrioritiesChange = (priorities: CalculatorInputs["priorities"]) => {
    setInputs((prev) => ({
      ...prev,
      priorities,
    }));
  };

  const handleForwarderToggle = (forwarder: string) => {
    setInputs(prev => {
      const selected = prev.selectedForwarders.includes(forwarder)
        ? prev.selectedForwarders.filter(f => f !== forwarder)
        : [...prev.selectedForwarders, forwarder];
      return {
        ...prev,
        selectedForwarders: selected
      };
    });
  };

  return {
    inputs,
    setInputs,
    validation,
    setValidation,
    resetInputs,
    handlePrioritiesChange,
    handleForwarderToggle
  };
};
