
import React from 'react';
import { CalculatorInputs, ShipmentData } from '@/types/shipment';
import { ForwarderRFQData } from "@/components/ForwarderRFQInputs";
import LiveQuoteInputs from './LiveQuoteInputs';
import RouteDetailsSection from './sections/RouteDetailsSection';
import CargoSpecificationsSection from './sections/CargoSpecificationsSection';
import PriorityWeightingSection from './sections/PriorityWeightingSection';
import ForwardersSelectionSection from './sections/ForwardersSelectionSection';
import OracleActivationSection from './sections/OracleActivationSection';

interface LiveQuote {
  forwarder: string;
  cost: number;
  transitDays: number;
  notes?: string;
}

interface ShipmentConfigurationPanelProps {
  inputs: CalculatorInputs;
  liveQuotes: LiveQuote[];
  validation: { weight?: string; volume?: string };
  forwarderRFQ: Record<string, ForwarderRFQData>;
  isAwakening: boolean;
  shipments: ShipmentData[];
  onInputsChange: (inputs: CalculatorInputs) => void;
  onLiveQuotesChange: (quotes: LiveQuote[]) => void;
  onPrioritiesChange: (priorities: CalculatorInputs["priorities"]) => void;
  onForwarderToggle: (forwarder: string) => void;
  onRFQChange: (forwarder: string, data: ForwarderRFQData) => void;
  onAwakenOracle: () => void;
}

const ShipmentConfigurationPanel: React.FC<ShipmentConfigurationPanelProps> = ({
  inputs,
  liveQuotes,
  validation,
  forwarderRFQ,
  isAwakening,
  shipments,
  onInputsChange,
  onLiveQuotesChange,
  onPrioritiesChange,
  onForwarderToggle,
  onRFQChange,
  onAwakenOracle
}) => {
  return (
    <div className="oracle-card p-4 sm:p-6 h-full">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center text-yellow-300">
        <i className="fas fa-shipping-fast mr-2 sm:mr-3 text-deepcal-light"></i>
        Shipment Configuration
      </h2>
      
      <div className="space-y-4 sm:space-y-6">
        <RouteDetailsSection
          inputs={inputs}
          shipments={shipments}
          onInputsChange={onInputsChange}
        />
        
        <CargoSpecificationsSection
          inputs={inputs}
          validation={validation}
          onInputsChange={onInputsChange}
        />
        
        <div>
          <LiveQuoteInputs
            quotes={liveQuotes}
            onQuotesChange={onLiveQuotesChange}
          />
        </div>
        
        <PriorityWeightingSection
          inputs={inputs}
          onPrioritiesChange={onPrioritiesChange}
        />
        
        <ForwardersSelectionSection
          inputs={inputs}
          forwarderRFQ={forwarderRFQ}
          onForwarderToggle={onForwarderToggle}
          onRFQChange={onRFQChange}
        />
        
        <OracleActivationSection
          isAwakening={isAwakening}
          validation={validation}
          onAwakenOracle={onAwakenOracle}
        />
      </div>
    </div>
  );
};

export default ShipmentConfigurationPanel;
