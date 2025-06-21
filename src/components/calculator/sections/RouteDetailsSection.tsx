
import React from 'react';
import { Info } from "lucide-react";
import { CalculatorInputs, ShipmentData } from '@/types/shipment';

interface RouteDetailsSectionProps {
  inputs: CalculatorInputs;
  shipments: ShipmentData[];
  onInputsChange: (inputs: CalculatorInputs) => void;
}

const RouteDetailsSection: React.FC<RouteDetailsSectionProps> = ({
  inputs,
  shipments,
  onInputsChange
}) => {
  const helpText = {
    modeOfShipment: "Select the transportation method for your shipment.",
    origin: "Select the shipment starting country.",
    destination: "Select the shipment destination."
  };

  const MODE_OPTIONS = ['Air', 'Sea', 'Road', 'Rail'];

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
    <div>
      <h3 className="font-medium mb-2 flex items-center text-yellow-300">
        <i className="fas fa-route mr-2 text-blue-400"></i>
        Route Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1 flex items-center gap-1 text-yellow-300">
            Origin
            <span title={helpText.origin}>
              <Info className="text-yellow-400 w-3 h-3" aria-label={helpText.origin} />
            </span>
          </label>
          <select 
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light text-white"
            value={inputs.origin}
            onChange={(e) => onInputsChange({...inputs, origin: e.target.value})}
          >
            <option value="">Select Origin</option>
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
          <label className="block text-sm mb-1 flex items-center gap-1 text-yellow-300">
            Destination
            <span title={helpText.destination}>
              <Info className="text-yellow-400 w-3 h-3" aria-label={helpText.destination} />
            </span>
          </label>
          <select 
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light text-white"
            value={inputs.destination}
            onChange={(e) => onInputsChange({...inputs, destination: e.target.value})}
          >
            <option value="">Select Destination</option>
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
      
      {/* Mode of Shipment */}
      <div className="mt-4">
        <label className="block text-sm mb-1 flex items-center gap-1 text-yellow-300">
          Mode of Shipment
          <span title={helpText.modeOfShipment}>
            <Info className="text-yellow-400 w-3 h-3" aria-label={helpText.modeOfShipment} />
          </span>
        </label>
        <select 
          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light text-white"
          value={inputs.modeOfShipment}
          onChange={(e) => onInputsChange({...inputs, modeOfShipment: e.target.value as any})}
        >
          {MODE_OPTIONS.map(mode => (
            <option key={mode} value={mode}>{mode}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RouteDetailsSection;
