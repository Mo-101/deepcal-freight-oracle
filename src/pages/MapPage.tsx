
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import DeepCALSymbolicHeader from '@/components/DeepCALSymbolicHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Globe, Package, Truck } from 'lucide-react';
import { shipmentTrackingService } from '@/services/shipmentTrackingService';

// Use the existing token and style
mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';

const MapPage: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeShipments, setActiveShipments] = useState(0);
  const [isTrackingActive, setIsTrackingActive] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Initialize map with enhanced configuration
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/akanimo1/cm8bw23rp00i801sbgbr258r0',
      center: [32.5825, 0.3476], // Focus on East Africa
      zoom: 4,
      pitch: 45,
      bearing: 0,
      projection: 'globe'
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add scale control
    map.current.addControl(new mapboxgl.ScaleControl({
      maxWidth: 100,
      unit: 'metric'
    }));

    // Map load event
    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Add atmosphere for 3D globe
      if (map.current) {
        map.current.setFog({
          color: 'rgb(186, 210, 235)',
          'high-color': 'rgb(36, 92, 223)',
          'horizon-blend': 0.02,
          'space-color': 'rgb(11, 11, 25)',
          'star-intensity': 0.6
        });

        // Add logistics markers and shipment tracking
        addLogisticsMarkers();
        initializeShipmentTracking();
      }
    });

    return () => map.current?.remove();
  }, []);

  const addLogisticsMarkers = () => {
    if (!map.current) return;

    // Key logistics hubs in East Africa
    const logisticsHubs = [
      { name: 'Nairobi', coords: [36.8219, -1.2921], type: 'major-hub' },
      { name: 'Kampala', coords: [32.5825, 0.3476], type: 'hub' },
      { name: 'Juba', coords: [31.5804, 4.8594], type: 'destination' },
      { name: 'Mombasa Port', coords: [39.6682, -4.0435], type: 'port' },
      { name: 'Dar es Salaam', coords: [39.2083, -6.7924], type: 'port' },
      { name: 'Kigali', coords: [30.0619, -1.9441], type: 'hub' }
    ];

    logisticsHubs.forEach(hub => {
      const el = document.createElement('div');
      el.className = `w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer ${
        hub.type === 'major-hub' ? 'bg-green-500' :
        hub.type === 'port' ? 'bg-blue-500' :
        hub.type === 'destination' ? 'bg-red-500' : 'bg-yellow-500'
      }`;

      new mapboxgl.Marker(el)
        .setLngLat(hub.coords as [number, number])
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<div class="p-2"><strong>${hub.name}</strong><br/><span class="text-sm">${hub.type.replace('-', ' ')}</span></div>`))
        .addTo(map.current!);
    });
  };

  const initializeShipmentTracking = () => {
    if (!map.current) return;

    // Add shipment tracking layer
    map.current.addSource('active-shipments', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    // Add shipment markers
    map.current.addLayer({
      id: 'shipment-markers',
      type: 'circle',
      source: 'active-shipments',
      paint: {
        'circle-radius': 6,
        'circle-color': '#00ff88',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });

    // Load active shipments
    updateActiveShipments();
  };

  const updateActiveShipments = () => {
    if (!map.current) return;

    const activeShipments = shipmentTrackingService.getAllActiveTrackings();
    setActiveShipments(activeShipments.length);

    const features = activeShipments.map(tracking => ({
      type: 'Feature' as const,
      properties: {
        shipmentId: tracking.shipmentId,
        status: tracking.status,
        carrier: tracking.carrier
      },
      geometry: {
        type: 'Point' as const,
        coordinates: tracking.currentLocation
      }
    }));

    const source = map.current.getSource('active-shipments') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features
      });
    }
  };

  const startLiveTracking = () => {
    setIsTrackingActive(true);
    
    // Simulate real-time updates
    const trackingInterval = setInterval(() => {
      // Update shipment location (mock)
      shipmentTrackingService.simulateLocationUpdate(
        'REQ-001',
        [36.8219 + (Math.random() - 0.5) * 0.5, -1.2921 + (Math.random() - 0.5) * 0.5]
      );
      
      // Update map
      updateActiveShipments();
    }, 5000);

    // Stop after 1 minute for demo
    setTimeout(() => {
      clearInterval(trackingInterval);
      setIsTrackingActive(false);
    }, 60000);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALSymbolicHeader />

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="w-full h-full" />
        
        {/* Tracking Controls */}
        <Card className="absolute top-4 right-4 w-80 bg-slate-900/90 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Package className="w-4 h-4" />
              Live Shipment Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Active Shipments</span>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {activeShipments}
                </Badge>
              </div>
              
              <Button 
                onClick={startLiveTracking} 
                disabled={isTrackingActive}
                className="w-full bg-green-600 hover:bg-green-700"
                size="sm"
              >
                {isTrackingActive ? (
                  <>
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    Tracking Live...
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4 mr-2" />
                    Start Live Demo
                  </>
                )}
              </Button>

              {isTrackingActive && (
                <div className="text-xs text-gray-400">
                  Real-time updates every 5 seconds
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Map Legend */}
        <Card className="absolute bottom-4 left-4 w-64 bg-slate-900/90 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white">Logistics Network</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                <span className="text-gray-300">Major Hub</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full border border-white"></div>
                <span className="text-gray-300">Regional Hub</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                <span className="text-gray-300">Port/Airport</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                <span className="text-gray-300">Destination</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-lime-400 rounded-full border border-white"></div>
                <span className="text-gray-300">Active Shipment</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading Overlay */}
        {!mapLoaded && (
          <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400 mx-auto mb-2"></div>
              <p>Loading DeepCAL Map...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
