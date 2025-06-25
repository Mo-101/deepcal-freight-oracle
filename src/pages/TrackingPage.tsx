
import React, { useState } from 'react';
import DeepCALSymbolicHeader from '@/components/DeepCALSymbolicHeader';
import ShipmentTracker from '@/components/ShipmentTracker';
import { useShipmentData } from '@/hooks/useShipmentData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Search } from 'lucide-react';

const TrackingPage: React.FC = () => {
  const { shipments, selectedReference, setSelectedReference, selectedShipment } = useShipmentData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShipments = shipments.filter(shipment =>
    shipment.request_reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.origin_country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.destination_country?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALSymbolicHeader />
      
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Package className="w-10 h-10 text-lime-400" />
            Real-Time Shipment Tracking
          </h1>
          <p className="text-gray-300 text-lg">
            Monitor your shipments in real-time with Mapbox-powered tracking
          </p>
        </div>

        {/* Shipment Selection */}
        <Card className="glass-card border border-slate-700 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Search className="w-5 h-5" />
              Select Shipment to Track
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Choose Shipment Reference
                </label>
                <Select
                  value={selectedReference || ""}
                  onValueChange={setSelectedReference}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select a shipment to track..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {filteredShipments.slice(0, 20).map((shipment) => (
                      <SelectItem
                        key={shipment.request_reference}
                        value={shipment.request_reference}
                        className="text-white hover:bg-slate-700"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{shipment.request_reference}</span>
                          <span className="text-sm text-gray-400">
                            {shipment.origin_country} → {shipment.destination_country}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <div className="text-sm text-gray-400">
                  <p>Available shipments: {filteredShipments.length}</p>
                  <p>Active tracking systems: Mapbox GL JS + Real-time updates</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Display */}
        {selectedShipment ? (
          <ShipmentTracker 
            shipment={selectedShipment}
            trackingData={{
              shipmentId: selectedShipment.request_reference,
              currentLocation: [36.8219, -1.2921], // Mock coordinates
              status: 'in-transit',
              lastUpdate: new Date().toISOString()
            }}
          />
        ) : (
          <Card className="glass-card border border-slate-700 bg-slate-900/50">
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Select a Shipment to Begin Tracking
              </h3>
              <p className="text-gray-400">
                Choose a shipment from the dropdown above to view real-time tracking information
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
