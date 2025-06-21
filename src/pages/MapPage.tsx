
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Globe } from 'lucide-react';

// Use the existing token and style
mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';

const MapPage: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Initialize map with enhanced configuration
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/akanimo1/cm8bw23rp00i501sbgbr258r0',
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

        // Add sample logistics markers
        addLogisticsMarkers();
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

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-slate-800/50 border-b border-white/10">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-400" />
            DeepCAL Logistics Map
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
            <span className="text-sm text-indigo-200">Live Tracking Active</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Badge className="bg-blue-900/20 text-blue-300 border-blue-400/30">
            <MapPin className="w-3 h-3 mr-1" />
            East Africa Focus
          </Badge>
          {mapLoaded && (
            <Badge className="bg-green-900/20 text-green-300 border-green-400/30">
              <Navigation className="w-3 h-3 mr-1" />
              Map Ready
            </Badge>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="w-full h-full" />
        
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
