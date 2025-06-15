
import React from 'react';
import { Info } from "lucide-react";
import { CalculatorInputs, ShipmentData } from '@/types/shipment';
import { CARGO_TYPE_OPTIONS, FORWARDER_OPTIONS } from '@/utils/shipmentMapper';
import InteractivePrioritySliders from "@/components/InteractivePrioritySliders";
import ForwarderRFQInputs, { ForwarderRFQData } from "@/components/ForwarderRFQInputs";

interface ShipmentConfigurationPanelProps {
  inputs: CalculatorInputs;
  validation: { weight?: string; volume?: string };
  forwarderRFQ: Record<string, ForwarderRFQData>;
  isAwakening: boolean;
  shipments: ShipmentData[];
  onInputsChange: (inputs: CalculatorInputs) => void;
  onPrioritiesChange: (priorities: CalculatorInputs["priorities"]) => void;
  onForwarderToggle: (forwarder: string) => void;
  onRFQChange: (forwarder: string, data: ForwarderRFQData) => void;
  onAwakenOracle: () => void;
}

const ShipmentConfigurationPanel: React.FC<ShipmentConfigurationPanelProps> = ({
  inputs,
  validation,
  forwarderRFQ,
  isAwakening,
  shipments,
  onInputsChange,
  onPrioritiesChange,
  onForwarderToggle,
  onRFQChange,
  onAwakenOracle
}) => {
  const helpText = {
    weight: "Total shipment weight in kilograms.",
    volume: "Total shipment volume in cubic meters (CBM).",
    cargoType: "What type of cargo is being shipped?",
    origin: "Select the shipment starting country.",
    destination: "Select the shipment destination.",
    forwarder: "Select one or more companies to compare."
  };

  // Extract unique countries from shipment data
  const getUniqueCountries = (field: 'origin' | 'destination') => {
    const countries = new Set<string>();
    shipments.forEach(shipment => {
      const country = field === 'origin' 
        ? (shipment.origin_country || shipment.origin)
        : (shipment.destination_country || shipment.destination);
      if (country && country.trim()) {
        countries.add(country.trim());
      }
    });
    return Array.from(countries).sort();
  };

  const originCountries = getUniqueCountries('origin');
  const destinationCountries = getUniqueCountries('destination');

  return (
    <div className="oracle-card p-6 h-full">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <i className="fas fa-shipping-fast mr-3 text-deepcal-light"></i>
        Shipment Configuration
      </h2>
      
      <div className="space-y-6">
        {/* Route Details */}
        <div>
          <h3 className="font-medium mb-2 flex items-center">
            <i className="fas fa-route mr-2 text-blue-400"></i>
            Route Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 flex items-center gap-1">
                Origin
                <span title={helpText.origin}>
                  <Info className="text-purple-400 w-3 h-3" aria-label={helpText.origin} />
                </span>
              </label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light"
                value={inputs.origin}
                onChange={(e) => onInputsChange({...inputs, origin: e.target.value})}
              >
                {originCountries.length > 0 ? (
                  originCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))
                ) : (
                  <option value="Kenya">Kenya</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1 flex items-center gap-1">
                Destination
                <span title={helpText.destination}>
                  <Info className="text-purple-400 w-3 h-3" aria-label={helpText.destination} />
                </span>
              </label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light"
                value={inputs.destination}
                onChange={(e) => onInputsChange({...inputs, destination: e.target.value})}
              >
                {destinationCountries.length > 0 ? (
                  destinationCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))
                ) : (
                  <option value="Zambia">Zambia</option>
                )}
              </select>
            </div>
          </div>
        </div>
        
        {/* Cargo Specifications */}
        <div>
          <h3 className="font-medium mb-2 flex items-center">
            <i className="fas fa-box-open mr-2 text-yellow-400"></i>
            Cargo Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 flex items-center gap-1">
                Weight (kg)
                <span title={helpText.weight}>
                  <Info className="text-purple-400 w-3 h-3" aria-label={helpText.weight} />
                </span>
              </label>
              <input 
                type="number" 
                value={inputs.weight}
                onChange={(e) => onInputsChange({...inputs, weight: parseFloat(e.target.value) || 0})}
                className={`w-full bg-slate-800 border ${validation.weight ? "border-rose-500" : "border-slate-700"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light`}
                aria-describedby="weight-help"
              />
              <div id="weight-help" className={`text-xs mt-1 ${validation.weight ? "text-rose-400" : "text-slate-400"}`}>
                {validation.weight || helpText.weight}
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1 flex items-center gap-1">
                Volume (CBM)
                <span title={helpText.volume}>
                  <Info className="text-purple-400 w-3 h-3" aria-label={helpText.volume} />
                </span>
              </label>
              <input 
                type="number" 
                value={inputs.volume}
                onChange={(e) => onInputsChange({...inputs, volume: parseFloat(e.target.value) || 0})}
                className={`w-full bg-slate-800 border ${validation.volume ? "border-rose-500" : "border-slate-700"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light`}
                aria-describedby="volume-help"
              />
              <div id="volume-help" className={`text-xs mt-1 ${validation.volume ? "text-rose-400" : "text-slate-400"}`}>
                {validation.volume || helpText.volume}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm mb-1 flex items-center gap-1">
              Cargo Type
              <span title={helpText.cargoType}>
                <Info className="text-purple-400 w-3 h-3" aria-label={helpText.cargoType} />
              </span>
            </label>
            <select 
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light"
              value={inputs.cargoType}
              onChange={(e) => onInputsChange({...inputs, cargoType: e.target.value})}
            >
              {CARGO_TYPE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Priority Weighting */}
        <div>
          <h3 className="font-medium mb-2 flex items-center">
            <i className="fas fa-balance-scale mr-2 text-purple-400"></i>
            Symbolic Priority Weighting
            <span title="Distribute 100% between these priorities to guide your result">
              <Info className="text-purple-400 w-3 h-3 ml-2" aria-label="Distribute 100% between these priorities to guide your result" />
            </span>
          </h3>
          <InteractivePrioritySliders
            value={inputs.priorities}
            onChange={onPrioritiesChange}
          />
        </div>
        
        {/* Forwarders Selection */}
        <div>
          <h3 className="font-medium mb-2 flex items-center">
            <i className="fas fa-truck-loading mr-2 text-amber-400"></i>
            Freight Forwarders
            <span title={helpText.forwarder}>
              <Info className="text-purple-400 w-3 h-3 ml-2" aria-label={helpText.forwarder} />
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
                <span className="ml-3">{forwarder}</span>
              </div>
            ))}
          </div>
          <ForwarderRFQInputs
            selectedForwarders={inputs.selectedForwarders}
            rfqData={forwarderRFQ}
            onChange={onRFQChange}
          />
        </div>
        
        {/* Oracle Activation */}
        <div>
          <button 
            onClick={onAwakenOracle}
            disabled={isAwakening || !!validation.weight || !!validation.volume}
            className="w-full mt-2 bg-gradient-to-r from-deepcal-purple to-deepcal-light hover:from-deepcal-light hover:to-deepcal-purple text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-900/50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-bolt mr-2"></i>
            {isAwakening ? 'Awakening the Oracle...' : 'Awaken the Oracle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentConfigurationPanel;
