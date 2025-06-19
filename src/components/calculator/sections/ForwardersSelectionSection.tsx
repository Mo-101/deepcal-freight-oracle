
import React from 'react';
import { Info } from "lucide-react";
import { CalculatorInputs } from '@/types/shipment';
import { FORWARDER_OPTIONS } from '@/utils/shipmentMapper';
import ForwarderRFQInputs, { ForwarderRFQData } from "@/components/ForwarderRFQInputs";

interface ForwardersSelectionSectionProps {
  inputs: CalculatorInputs;
  forwarderRFQ: Record<string, ForwarderRFQData>;
  onForwarderToggle: (forwarder: string) => void;
  onRFQChange: (forwarder: string, data: ForwarderRFQData) => void;
}

const ForwardersSelectionSection: React.FC<ForwardersSelectionSectionProps> = ({
  inputs,
  forwarderRFQ,
  onForwarderToggle,
  onRFQChange
}) => {
  const helpText = {
    forwarder: "Select one or more companies to compare."
  };

  return (
    <div>
      <h3 className="font-medium mb-2 flex items-center text-yellow-300">
        <i className="fas fa-truck-loading mr-2 text-amber-400"></i>
        Freight Forwarders
        <span title={helpText.forwarder}>
          <Info className="text-yellow-400 w-3 h-3 ml-2" aria-label={helpText.forwarder} />
        </span>
      </h3>
      <div className="space-y-2">
        {FORWARDER_OPTIONS.map(forwarder => (
          <div key={forwarder} className="flex items-center bg-slate-800 p-3 rounded-lg border border-slate-700">
            <input 
              type="checkbox" 
              className="form-checkbox text-deepcal-light"
              checked={inputs.selectedForwarders.includes(forwarder)}
              onChange={() => onForwarderToggle(forwarder)}
            />
            <span className="ml-3 text-white">{forwarder}</span>
          </div>
        ))}
      </div>
      <ForwarderRFQInputs
        selectedForwarders={inputs.selectedForwarders}
        rfqData={forwarderRFQ}
        onChange={onRFQChange}
      />
    </div>
  );
};

export default ForwardersSelectionSection;
