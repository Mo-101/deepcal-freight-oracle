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
  Plus,
  Search,
  Filter
} from 'lucide-react';

interface ReferenceShipment {
  id: string;
  origin: string;
  destination: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  cost: number;
  transitTime: number;
  carrier: string;
  date: string;
  type: 'LTL' | 'FTL' | 'Parcel' | 'Express';
}

interface ReferenceShipmentSelectorProps {
  selectedShipment?: ReferenceShipment;
  onShipmentSelect: (shipment: ReferenceShipment) => void;
}

const mockShipments: ReferenceShipment[] = [
  {
    id: 'REF-001',
    origin: 'Los Angeles, CA',
    destination: 'New York, NY',
    weight: 1500,
    dimensions: { length: 48, width: 40, height: 36 },
    cost: 2850,
    transitTime: 5,
    carrier: 'FedEx Freight',
    date: '2024-01-15',
    type: 'LTL'
  },
  {
    id: 'REF-002',
    origin: 'Chicago, IL',
    destination: 'Miami, FL',
    weight: 2200,
    dimensions: { length: 96, width: 48, height: 48 },
    cost: 3200,
    transitTime: 3,
    carrier: 'UPS Freight',
    date: '2024-01-12',
    type: 'FTL'
  },
  {
    id: 'REF-003',
    origin: 'Seattle, WA',
    destination: 'Denver, CO',
    weight: 850,
    dimensions: { length: 24, width: 18, height: 12 },
    cost: 450,
    transitTime: 2,
    carrier: 'DHL Express',
    date: '2024-01-18',
    type: 'Express'
  },
  {
    id: 'REF-004',
    origin: 'Houston, TX',
    destination: 'Atlanta, GA',
    weight: 500,
    dimensions: { length: 12, width: 10, height: 8 },
    cost: 125,
    transitTime: 1,
    carrier: 'UPS Ground',
    date: '2024-01-20',
    type: 'Parcel'
  }
];

export default function ReferenceShipmentSelector({ selectedShipment, onShipmentSelect }: ReferenceShipmentSelectorProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredShipments = mockShipments.filter(shipment => {
    const matchesType = filterType === 'all' || shipment.type === filterType;
    const matchesSearch = searchTerm === '' || 
      shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.carrier.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'LTL':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'FTL':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Express':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Parcel':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="bg-white/10 border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-lime-400" />
            Reference Shipment
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by origin, destination, or carrier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
              />
            </div>
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="LTL">LTL</SelectItem>
              <SelectItem value="FTL">FTL</SelectItem>
              <SelectItem value="Express">Express</SelectItem>
              <SelectItem value="Parcel">Parcel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Selected Shipment Display */}
        {selectedShipment && (
          <div className="p-4 bg-lime-500/10 border border-lime-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-lime-400" />
                <span className="font-medium text-lime-400">Selected Reference</span>
              </div>
              <Badge className={getTypeColor(selectedShipment.type)}>
                {selectedShipment.type}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-300">
                  <MapPin className="w-3 h-3" />
                  <span>{selectedShipment.origin} → {selectedShipment.destination}</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-300">
                  <Weight className="w-3 h-3" />
                  <span>{selectedShipment.weight} lbs</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-300">
                  <Ruler className="w-3 h-3" />
                  <span>{selectedShipment.dimensions.length}"×{selectedShipment.dimensions.width}"×{selectedShipment.dimensions.height}"</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-300">
                  <DollarSign className="w-3 h-3" />
                  <span>${selectedShipment.cost.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-300">
                  <Clock className="w-3 h-3" />
                  <span>{selectedShipment.transitTime} days</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-300">
                  <Truck className="w-3 h-3" />
                  <span>{selectedShipment.carrier}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shipment List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredShipments.map((shipment) => (
            <div
              key={shipment.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-white/5 ${
                selectedShipment?.id === shipment.id
                  ? 'border-lime-500/50 bg-lime-500/10'
                  : 'border-white/10 bg-white/5'
              }`}
              onClick={() => onShipmentSelect(shipment)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{shipment.id}</span>
                  <Badge className={getTypeColor(shipment.type)}>
                    {shipment.type}
                  </Badge>
                </div>
                <div className="text-sm text-indigo-300">
                  {new Date(shipment.date).toLocaleDateString()}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs text-indigo-300">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{shipment.origin}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{shipment.destination}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span>${shipment.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{shipment.transitTime} days</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-indigo-300">
                    <Weight className="w-3 h-3" />
                    <span>{shipment.weight} lbs</span>
                  </div>
                  <div className="flex items-center gap-1 text-indigo-300">
                    <Truck className="w-3 h-3" />
                    <span>{shipment.carrier}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredShipments.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No shipments found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}