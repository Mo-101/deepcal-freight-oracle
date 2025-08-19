import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Package, 
  MapPin, 
  Calendar, 
  DollarSign,
  Truck,
  Clock,
  Weight,
  Ruler,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface ShipmentConfiguration {
  origin: string;
  destination: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  shipmentType: 'LTL' | 'FTL' | 'Parcel' | 'Express';
  serviceLevel: 'Standard' | 'Expedited' | 'Next Day';
  specialRequirements: string[];
  declaredValue: number;
  pickupDate: string;
  deliveryDate?: string;
}

interface ShipmentConfigurationPanelProps {
  configuration: ShipmentConfiguration;
  onConfigurationChange: (config: ShipmentConfiguration) => void;
  onCalculate: () => void;
  isCalculating?: boolean;
}

const specialRequirementOptions = [
  'Hazardous Materials',
  'Temperature Controlled',
  'White Glove Service',
  'Liftgate Required',
  'Residential Delivery',
  'Inside Delivery',
  'Appointment Required',
  'Fragile Handling'
];

export default function ShipmentConfigurationPanel({ 
  configuration, 
  onConfigurationChange, 
  onCalculate,
  isCalculating = false 
}: ShipmentConfigurationPanelProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateConfiguration = (updates: Partial<ShipmentConfiguration>) => {
    const newConfig = { ...configuration, ...updates };
    onConfigurationChange(newConfig);
    validateConfiguration(newConfig);
  };

  const validateConfiguration = (config: ShipmentConfiguration) => {
    const newErrors: Record<string, string> = {};

    if (!config.origin.trim()) {
      newErrors.origin = 'Origin is required';
    }
    if (!config.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }
    if (config.weight <= 0) {
      newErrors.weight = 'Weight must be greater than 0';
    }
    if (config.dimensions.length <= 0 || config.dimensions.width <= 0 || config.dimensions.height <= 0) {
      newErrors.dimensions = 'All dimensions must be greater than 0';
    }
    if (config.declaredValue <= 0) {
      newErrors.declaredValue = 'Declared value must be greater than 0';
    }
    if (!config.pickupDate) {
      newErrors.pickupDate = 'Pickup date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSpecialRequirementToggle = (requirement: string) => {
    const current = configuration.specialRequirements;
    const updated = current.includes(requirement)
      ? current.filter(r => r !== requirement)
      : [...current, requirement];
    
    updateConfiguration({ specialRequirements: updated });
  };

  const isValid = Object.keys(errors).length === 0;
  const totalVolume = configuration.dimensions.length * configuration.dimensions.width * configuration.dimensions.height;
  const density = configuration.weight / (totalVolume / 1728); // lbs per cubic foot

  return (
    <Card className="bg-white/10 border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-lime-400" />
          Shipment Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Origin & Destination */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Origin
            </label>
            <input
              type="text"
              value={configuration.origin}
              onChange={(e) => updateConfiguration({ origin: e.target.value })}
              placeholder="Enter origin city, state"
              className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent ${
                errors.origin ? 'border-red-500' : 'border-white/20'
              }`}
            />
            {errors.origin && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.origin}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Destination
            </label>
            <input
              type="text"
              value={configuration.destination}
              onChange={(e) => updateConfiguration({ destination: e.target.value })}
              placeholder="Enter destination city, state"
              className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent ${
                errors.destination ? 'border-red-500' : 'border-white/20'
              }`}
            />
            {errors.destination && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.destination}
              </p>
            )}
          </div>
        </div>

        {/* Weight & Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <Weight className="w-4 h-4" />
              Weight (lbs)
            </label>
            <input
              type="number"
              value={configuration.weight}
              onChange={(e) => updateConfiguration({ weight: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              min="0"
              step="0.1"
              className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent ${
                errors.weight ? 'border-red-500' : 'border-white/20'
              }`}
            />
            {errors.weight && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.weight}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Dimensions (L × W × H inches)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                value={configuration.dimensions.length}
                onChange={(e) => updateConfiguration({ 
                  dimensions: { 
                    ...configuration.dimensions, 
                    length: parseFloat(e.target.value) || 0 
                  } 
                })}
                placeholder="L"
                min="0"
                step="0.1"
                className={`px-2 py-2 bg-white/10 border rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent ${
                  errors.dimensions ? 'border-red-500' : 'border-white/20'
                }`}
              />
              <input
                type="number"
                value={configuration.dimensions.width}
                onChange={(e) => updateConfiguration({ 
                  dimensions: { 
                    ...configuration.dimensions, 
                    width: parseFloat(e.target.value) || 0 
                  } 
                })}
                placeholder="W"
                min="0"
                step="0.1"
                className={`px-2 py-2 bg-white/10 border rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent ${
                  errors.dimensions ? 'border-red-500' : 'border-white/20'
                }`}
              />
              <input
                type="number"
                value={configuration.dimensions.height}
                onChange={(e) => updateConfiguration({ 
                  dimensions: { 
                    ...configuration.dimensions, 
                    height: parseFloat(e.target.value) || 0 
                  } 
                })}
                placeholder="H"
                min="0"
                step="0.1"
                className={`px-2 py-2 bg-white/10 border rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent ${
                  errors.dimensions ? 'border-red-500' : 'border-white/20'
                }`}
              />
            </div>
            {errors.dimensions && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.dimensions}
              </p>
            )}
          </div>
        </div>

        {/* Shipment Type & Service Level */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Shipment Type
            </label>
            <Select 
              value={configuration.shipmentType} 
              onValueChange={(value: any) => updateConfiguration({ shipmentType: value })}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LTL">Less Than Truckload (LTL)</SelectItem>
                <SelectItem value="FTL">Full Truckload (FTL)</SelectItem>
                <SelectItem value="Parcel">Parcel</SelectItem>
                <SelectItem value="Express">Express</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Service Level
            </label>
            <Select 
              value={configuration.serviceLevel} 
              onValueChange={(value: any) => updateConfiguration({ serviceLevel: value })}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Expedited">Expedited</SelectItem>
                <SelectItem value="Next Day">Next Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dates & Declared Value */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Pickup Date
            </label>
            <input
              type="date"
              value={configuration.pickupDate}
              onChange={(e) => updateConfiguration({ pickupDate: e.target.value })}
              className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent ${
                errors.pickupDate ? 'border-red-500' : 'border-white/20'
              }`}
            />
            {errors.pickupDate && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.pickupDate}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Declared Value
            </label>
            <input
              type="number"
              value={configuration.declaredValue}
              onChange={(e) => updateConfiguration({ declaredValue: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent ${
                errors.declaredValue ? 'border-red-500' : 'border-white/20'
              }`}
            />
            {errors.declaredValue && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.declaredValue}
              </p>
            )}
          </div>
        </div>

        {/* Special Requirements */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">Special Requirements</label>
          <div className="grid grid-cols-2 gap-2">
            {specialRequirementOptions.map((requirement) => (
              <label
                key={requirement}
                className="flex items-center gap-2 p-2 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={configuration.specialRequirements.includes(requirement)}
                  onChange={() => handleSpecialRequirementToggle(requirement)}
                  className="rounded border-white/20 bg-white/10 text-lime-400 focus:ring-lime-400"
                />
                <span className="text-sm text-white">{requirement}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Configuration Summary
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs text-indigo-300">
            <div className="space-y-1">
              <div>Volume: {totalVolume.toFixed(0)} cubic inches</div>
              <div>Density: {density.toFixed(1)} lbs/ft³</div>
              <div>Special Requirements: {configuration.specialRequirements.length}</div>
            </div>
            <div className="space-y-1">
              <div>Route: {configuration.origin} → {configuration.destination}</div>
              <div>Service: {configuration.serviceLevel} {configuration.shipmentType}</div>
              <div>Value: ${configuration.declaredValue.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <Button
          onClick={onCalculate}
          disabled={!isValid || isCalculating}
          className="w-full bg-lime-600 hover:bg-lime-700 text-black font-medium"
        >
          {isCalculating ? (
            <>
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin mr-2" />
              Calculating...
            </>
          ) : (
            <>
              <Package className="w-4 h-4 mr-2" />
              Calculate Freight Cost
            </>
          )}
        </Button>

        {!isValid && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-sm text-red-400">
              Please fix the errors above before calculating
            </span>
          </div>
        )}

        {isValid && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="text-sm text-green-400">
              Configuration is valid and ready for calculation
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}