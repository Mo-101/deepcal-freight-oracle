
import mapboxgl from 'mapbox-gl';

interface TrackingEvent {
  timestamp: string;
  location: [number, number];
  status: 'picked-up' | 'in-transit' | 'customs' | 'out-for-delivery' | 'delivered' | 'delayed';
  description: string;
  address?: string;
}

interface ShipmentTracking {
  shipmentId: string;
  currentLocation: [number, number];
  status: TrackingEvent['status'];
  events: TrackingEvent[];
  estimatedDelivery?: string;
  carrier: string;
}

export class ShipmentTrackingService {
  private trackingData = new Map<string, ShipmentTracking>();
  private updateCallbacks = new Map<string, (data: ShipmentTracking) => void>();

  constructor() {
    // Initialize with some mock tracking data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Sample tracking data for demonstration
    const sampleTracking: ShipmentTracking = {
      shipmentId: 'REQ-001',
      currentLocation: [36.8219, -1.2921], // Nairobi
      status: 'in-transit',
      carrier: 'DHL Express',
      estimatedDelivery: '2024-06-30T14:00:00Z',
      events: [
        {
          timestamp: '2024-06-25T08:00:00Z',
          location: [36.8219, -1.2921],
          status: 'picked-up',
          description: 'Package picked up from origin',
          address: 'Nairobi, Kenya'
        },
        {
          timestamp: '2024-06-25T12:00:00Z',
          location: [36.8500, -1.2800],
          status: 'in-transit',
          description: 'In transit to destination',
          address: 'En route via A104'
        }
      ]
    };
    
    this.trackingData.set('REQ-001', sampleTracking);
  }

  // Subscribe to real-time updates for a shipment
  subscribeToShipment(shipmentId: string, callback: (data: ShipmentTracking) => void): () => void {
    this.updateCallbacks.set(shipmentId, callback);
    
    // Send initial data if available
    const existing = this.trackingData.get(shipmentId);
    if (existing) {
      callback(existing);
    }

    // Return unsubscribe function
    return () => {
      this.updateCallbacks.delete(shipmentId);
    };
  }

  // Get current tracking data for a shipment
  getTrackingData(shipmentId: string): ShipmentTracking | null {
    return this.trackingData.get(shipmentId) || null;
  }

  // Simulate real-time updates (in production, this would come from your IoT devices/carriers)
  simulateLocationUpdate(shipmentId: string, newLocation: [number, number], status?: TrackingEvent['status']) {
    const tracking = this.trackingData.get(shipmentId);
    if (!tracking) return;

    // Update current location
    tracking.currentLocation = newLocation;
    if (status) tracking.status = status;

    // Add new event
    const newEvent: TrackingEvent = {
      timestamp: new Date().toISOString(),
      location: newLocation,
      status: status || tracking.status,
      description: `Location updated: ${newLocation[1].toFixed(4)}, ${newLocation[0].toFixed(4)}`
    };
    tracking.events.push(newEvent);

    // Update storage
    this.trackingData.set(shipmentId, tracking);

    // Notify subscribers
    const callback = this.updateCallbacks.get(shipmentId);
    if (callback) {
      callback(tracking);
    }
  }

  // Create tracking for a new shipment
  createTracking(shipmentId: string, initialLocation: [number, number], carrier: string): ShipmentTracking {
    const tracking: ShipmentTracking = {
      shipmentId,
      currentLocation: initialLocation,
      status: 'picked-up',
      carrier,
      events: [{
        timestamp: new Date().toISOString(),
        location: initialLocation,
        status: 'picked-up',
        description: 'Shipment tracking initiated'
      }]
    };

    this.trackingData.set(shipmentId, tracking);
    return tracking;
  }

  // Get all active trackings
  getAllActiveTrackings(): ShipmentTracking[] {
    return Array.from(this.trackingData.values())
      .filter(tracking => tracking.status !== 'delivered');
  }

  // Reverse geocoding helper (would use Mapbox Geocoding API in production)
  async reverseGeocode(coordinates: [number, number]): Promise<string> {
    // Get access token from environment or a dedicated service
    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'your-mapbox-token';
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${accessToken}`
      );
      const data = await response.json();
      return data.features[0]?.place_name || 'Unknown location';
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return 'Unknown location';
    }
  }
}

// Export singleton instance
export const shipmentTrackingService = new ShipmentTrackingService();
