
import React from 'react';
import { Info } from "lucide-react";
import { CalculatorInputs } from '@/types/shipment';
import InteractivePrioritySliders from "@/components/InteractivePrioritySliders";

interface PriorityWeightingSectionProps {
  inputs: CalculatorInputs;
  onPrioritiesChange: (priorities: CalculatorInputs["priorities"]) => void;
}

const PriorityWeightingSection: React.FC<PriorityWeightingSectionProps> = ({
  inputs,
  onPrioritiesChange
}) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium flex items-center text-yellow-300 text-sm sm:text-base">
        <i className="fas fa-balance-scale mr-2 text-purple-400"></i>
        Symbolic Priority Weighting
        <span title="Distribute 100% between these priorities to guide your result">
          <Info className="text-yellow-400 w-3 h-3 ml-2" aria-label="Distribute 100% between these priorities to guide your result" />
        </span>
      </h3>
      <InteractivePrioritySliders
        value={inputs.priorities}
        onChange={onPrioritiesChange}
      />
    </div>
  );
};

export default PriorityWeightingSection;
