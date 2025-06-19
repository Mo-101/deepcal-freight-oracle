
import React from 'react';
import { Info } from "lucide-react";
import { CalculatorInputs } from '@/types/shipment';
import { CARGO_TYPE_OPTIONS } from '@/utils/shipmentMapper';

interface CargoSpecificationsSectionProps {
  inputs: CalculatorInputs;
  validation: { weight?: string; volume?: string };
  onInputsChange: (inputs: CalculatorInputs) => void;
}

const CargoSpecificationsSection: React.FC<CargoSpecificationsSectionProps> = ({
  inputs,
  validation,
  onInputsChange
}) => {
  const helpText = {
    weight: "Total shipment weight in kilograms.",
    volume: "Total shipment volume in cubic meters (CBM).",
    cargoType: "What type of cargo is being shipped?"
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onInputsChange({...inputs, weight: value});
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onInputsChange({...inputs, volume: value});
  };

  const handleCargoTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onInputsChange({...inputs, cargoType: e.target.value});
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium flex items-center text-yellow-300 text-sm sm:text-base">
        <i className="fas fa-box-open mr-2 text-yellow-400"></i>
        Cargo Specifications
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm mb-1 flex items-center gap-1 text-yellow-300">
            Weight (kg)
            <span title={helpText.weight}>
              <Info className="text-yellow-400 w-3 h-3" aria-label={helpText.weight} />
            </span>
          </label>
          <input 
            type="number" 
            value={inputs.weight === 0 ? '' : inputs.weight}
            placeholder="Enter weight"
            onChange={handleWeightChange}
            className={`w-full bg-slate-800 border ${validation.weight ? "border-rose-500" : "border-slate-700"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light text-white text-sm sm:text-base`}
            aria-describedby="weight-help"
          />
          <div id="weight-help" className={`text-xs mt-1 ${validation.weight ? "text-rose-400" : "text-yellow-200"}`}>
            {validation.weight || helpText.weight}
          </div>
        </div>
        
        <div>
          <label className="block text-xs sm:text-sm mb-1 flex items-center gap-1 text-yellow-300">
            Volume (CBM)
            <span title={helpText.volume}>
              <Info className="text-yellow-400 w-3 h-3" aria-label={helpText.volume} />
            </span>
          </label>
          <input 
            type="number" 
            value={inputs.volume === 0 ? '' : inputs.volume}
            placeholder="Enter volume"
            onChange={handleVolumeChange}
            className={`w-full bg-slate-800 border ${validation.volume ? "border-rose-500" : "border-slate-700"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light text-white text-sm sm:text-base`}
            aria-describedby="volume-help"
          />
          <div id="volume-help" className={`text-xs mt-1 ${validation.volume ? "text-rose-400" : "text-yellow-200"}`}>
            {validation.volume || helpText.volume}
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-xs sm:text-sm mb-1 flex items-center gap-1 text-yellow-300">
          Cargo Type
          <span title={helpText.cargoType}>
            <Info className="text-yellow-400 w-3 h-3" aria-label={helpText.cargoType} />
          </span>
        </label>
        <select 
          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light text-white text-sm sm:text-base"
          value={inputs.cargoType}
          onChange={handleCargoTypeChange}
        >
          <option value="">Select cargo type</option>
          {CARGO_TYPE_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CargoSpecificationsSection;
