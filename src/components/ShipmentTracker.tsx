
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Truck, Package, Clock, Route } from 'lucide-react';
import { ShipmentData } from '@/types/shipment';

// Use your existing Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';

interface TrackingData {
  shipmentId: string;
  currentLocation: [number, number]; // [longitude, latitude]
  status: 'in-transit' | 'delivered' | 'pickup' | 'customs' | 'delayed';
  lastUpdate: string;
  nextStop?: string;
  estimatedArrival?: string;
}

interface ShipmentTrackerProps {
  shipment: ShipmentData;
  trackingData?: TrackingData;
}

const ShipmentTracker: React.FC<ShipmentTrackerProps> = ({ shipment, trackingData }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [mockLocation, setMockLocation] = useState<[number, number]>([36.8219, -1.2921]); // Start at Nairobi

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/akanimo1/cm8bw23rp00i801sbgbr258r0',
      center: mockLocation,
      zoom: 6,
      pitch: 45,
      bearing: 0
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'top-right'
    );

    map.current.on('load', () => {
      if (!map.current) return;

      // Add shipment route source
      map.current.addSource('shipment-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        }
      });

      // Add route line
      map.current.addLayer({
        id: 'shipment-route-line',
        type: 'line',
        source: 'shipment-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#00ff88',
          'line-width': 3,
          'line-opacity': 0.8
        }
      });

      // Add current location source
      map.current.addSource('shipment-location', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {
              status: trackingData?.status || 'in-transit'
            },
            geometry: {
              type: 'Point',
              coordinates: mockLocation
            }
          }]
        }
      });

      // Add shipment marker
      map.current.addLayer({
        id: 'shipment-marker',
        type: 'circle',
        source: 'shipment-location',
        paint: {
          'circle-radius': 8,
          'circle-color': [
            'match',
            ['get', 'status'],
            'in-transit', '#00ff88',
            'delivered', '#22c55e',
            'pickup', '#3b82f6',
            'customs', '#f59e0b',
            'delayed', '#ef4444',
            '#6b7280'
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Add origin and destination markers
      addOriginDestinationMarkers();
    });

    return () => map.current?.remove();
  }, []);

  const addOriginDestinationMarkers = () => {
    if (!map.current || !shipment.origin_country || !shipment.destination_country) return;

    // Sample coordinates for common locations
    const locationCoords: Record<string, [number, number]> = {
      'Kenya': [36.8219, -1.2921],
      'Uganda': [32.5825, 0.3476],
      'South Sudan': [31.5804, 4.8594],
      'Tanzania': [39.2083, -6.7924],
      'Rwanda': [30.0619, -1.9441],
      'Burundi': [29.3644, -3.3731]
    };

    const originCoords = locationCoords[shipment.origin_country] || [36.8219, -1.2921];
    const destCoords = locationCoords[shipment.destination_country] || [32.5825, 0.3476];

    // Origin marker
    const originEl = document.createElement('div');
    originEl.className = 'w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg';
    new mapboxgl.Marker(originEl)
      .setLngLat(originCoords)
      .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<div class="p-2"><strong>Origin</strong><br/>${shipment.origin_country}</div>`))
      .addTo(map.current);

    // Destination marker
    const destEl = document.createElement('div');
    destEl.className = 'w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg';
    new mapboxgl.Marker(destEl)
      .setLngLat(destCoords)
      .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<div class="p-2"><strong>Destination</strong><br/>${shipment.destination_country}</div>`))
      .addTo(map.current);
  };

  const simulateTracking = () => {
    if (!map.current) return;

    setIsTracking(true);
    
    // Simulate movement every 3 seconds
    const trackingInterval = setInterval(() => {
      setMockLocation(prev => {
        // Simple simulation: move slightly towards destination
        const newLng = prev[0] + (Math.random() - 0.5) * 0.1;
        const newLat = prev[1] + (Math.random() - 0.5) * 0.1;
        const newLocation: [number, number] = [newLng, newLat];

        // Update map data
        if (map.current) {
          const source = map.current.getSource('shipment-location') as mapboxgl.GeoJSONSource;
          if (source) {
            source.setData({
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                properties: { status: 'in-transit' },
                geometry: {
                  type: 'Point',
                  coordinates: newLocation
                }
              }]
            });
          }

          // Smoothly move camera to follow shipment
          map.current.flyTo({
            center: newLocation,
            duration: 2000,
            essential: true
          });
        }

        return newLocation;
      });
    }, 3000);

    // Stop simulation after 30 seconds
    setTimeout(() => {
      clearInterval(trackingInterval);
      setIsTracking(false);
    }, 30000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'in-transit': return 'bg-blue-500';
      case 'delayed': return 'bg-red-500';
      case 'customs': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Tracking Info Panel */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Package className="w-5 h-5" />
            Shipment Tracking: {shipment.request_reference}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Origin</p>
                <p className="font-medium">{shipment.origin_country}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-xs text-muted-foreground">Destination</p>
                <p className="font-medium">{shipment.destination_country}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Carrier</p>
                <p className="font-medium">{shipment.carrier || 'TBD'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge className={`${getStatusColor(trackingData?.status || 'in-transit')} text-white`}>
                  {trackingData?.status || 'In Transit'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={simulateTracking} 
              disabled={isTracking}
              className="glass-button"
            >
              {isTracking ? 'Tracking Live...' : 'Start Live Tracking Demo'}
            </Button>
            {isTracking && (
              <Badge variant="outline" className="animate-pulse">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Live Updates
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <Card className="glass-card">
        <CardContent className="p-0">
          <div ref={mapContainer} className="w-full h-[500px] rounded-lg" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentTracker;
