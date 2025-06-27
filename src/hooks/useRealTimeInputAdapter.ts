
import { useState, useEffect, useCallback, useRef } from 'react';

interface RealTimeConfig {
  url?: string;
  method?: 'sse' | 'websocket' | 'polling';
  interval?: number; // for polling
  headers?: Record<string, string>;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

interface RealTimeData {
  freight?: {
    forwarders: any[];
    routes: any[];
    pricing: any[];
    capacity: any[];
  };
  cargo?: {
    type: string;
    weight: number;
    volume: number;
    temperature?: number;
    hazardous?: boolean;
  };
  market?: {
    fuel_costs: number;
    port_congestion: Record<string, number>;
    weather_disruptions: any[];
    exchange_rates: Record<string, number>;
  };
  corridors?: {
    id: string;
    status: 'open' | 'congested' | 'closed';
    delay_factor: number;
    cost_multiplier: number;
  }[];
}

export const useRealTimeInputAdapter = (config: RealTimeConfig) => {
  const [data, setData] = useState<RealTimeData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const connectionRef = useRef<EventSource | WebSocket | NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  
  const maxReconnectAttempts = 5;
  const reconnectDelay = 2000;

  const processIncomingData = useCallback((rawData: any) => {
    try {
      let parsedData;
      
      if (typeof rawData === 'string') {
        parsedData = JSON.parse(rawData);
      } else {
        parsedData = rawData;
      }

      // Validate and structure the data
      const structuredData: RealTimeData = {
        freight: parsedData.freight || data?.freight,
        cargo: parsedData.cargo || data?.cargo,
        market: parsedData.market || data?.market,
        corridors: parsedData.corridors || data?.corridors
      };

      setData(structuredData);
      setLastUpdate(new Date());
      setError(null);
      reconnectAttempts.current = 0;

      console.log('📡 Real-time data updated:', {
        freight: !!structuredData.freight,
        cargo: !!structuredData.cargo,
        market: !!structuredData.market,
        corridors: !!structuredData.corridors,
        timestamp: new Date().toISOString()
      });

    } catch (err) {
      console.error('Failed to process real-time data:', err);
      setError(new Error('Data processing failed'));
      config.onError?.(new Error('Data processing failed'));
    }
  }, [data, config]);

  const connectSSE = useCallback(() => {
    if (!config.url) return;

    console.log('🔌 Connecting to SSE stream:', config.url);
    
    const eventSource = new EventSource(config.url);
    
    eventSource.onopen = () => {
      console.log('✅ SSE connection established');
      setIsConnected(true);
      setError(null);
      config.onConnect?.();
    };
    
    eventSource.onmessage = (event) => {
      processIncomingData(event.data);
    };
    
    eventSource.onerror = (event) => {
      console.error('❌ SSE connection error:', event);
      setIsConnected(false);
      const error = new Error('SSE connection failed');
      setError(error);
      config.onError?.(error);
      
      if (reconnectAttempts.current < maxReconnectAttempts) {
        scheduleReconnect();
      }
    };
    
    connectionRef.current = eventSource;
  }, [config, processIncomingData]);

  const connectWebSocket = useCallback(() => {
    if (!config.url) return;

    console.log('🔌 Connecting to WebSocket:', config.url);
    
    const ws = new WebSocket(config.url);
    
    ws.onopen = () => {
      console.log('✅ WebSocket connection established');
      setIsConnected(true);
      setError(null);
      config.onConnect?.();
    };
    
    ws.onmessage = (event) => {
      processIncomingData(event.data);
    };
    
    ws.onerror = (event) => {
      console.error('❌ WebSocket error:', event);
      const error = new Error('WebSocket connection failed');
      setError(error);
      config.onError?.(error);
    };
    
    ws.onclose = () => {
      console.log('🔌 WebSocket connection closed');
      setIsConnected(false);
      config.onDisconnect?.();
      
      if (reconnectAttempts.current < maxReconnectAttempts) {
        scheduleReconnect();
      }
    };
    
    connectionRef.current = ws;
  }, [config, processIncomingData]);

  const startPolling = useCallback(() => {
    if (!config.url) return;

    console.log('🔄 Starting polling:', config.url, `every ${config.interval || 30000}ms`);
    
    const poll = async () => {
      try {
        const response = await fetch(config.url!, {
          headers: config.headers || {}
        });
        
        if (!response.ok) {
          throw new Error(`Polling failed: ${response.status}`);
        }
        
        const data = await response.json();
        processIncomingData(data);
        setIsConnected(true);
        setError(null);
        
      } catch (err) {
        console.error('❌ Polling error:', err);
        setIsConnected(false);
        const error = err instanceof Error ? err : new Error('Polling failed');
        setError(error);
        config.onError?.(error);
      }
    };

    // Initial poll
    poll();
    
    // Set up interval
    const interval = setInterval(poll, config.interval || 30000);
    connectionRef.current = interval;
  }, [config, processIncomingData]);

  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    reconnectAttempts.current += 1;
    const delay = reconnectDelay * Math.pow(2, reconnectAttempts.current - 1); // Exponential backoff
    
    console.log(`🔄 Scheduling reconnect attempt ${reconnectAttempts.current} in ${delay}ms`);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, delay);
  }, []);

  const connect = useCallback(() => {
    disconnect(); // Clean up any existing connection
    
    if (!config.url) {
      console.warn('⚠️ No URL provided for real-time connection');
      return;
    }

    const method = config.method || 'sse';
    
    switch (method) {
      case 'sse':
        connectSSE();
        break;
      case 'websocket':
        connectWebSocket();
        break;
      case 'polling':
        startPolling();
        break;
      default:
        console.error('❌ Unsupported connection method:', method);
    }
  }, [config, connectSSE, connectWebSocket, startPolling]);

  const disconnect = useCallback(() => {
    if (connectionRef.current) {
      if (connectionRef.current instanceof EventSource) {
        connectionRef.current.close();
      } else if (connectionRef.current instanceof WebSocket) {
        connectionRef.current.close();
      } else {
        clearInterval(connectionRef.current as NodeJS.Timeout);
      }
      connectionRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setIsConnected(false);
    config.onDisconnect?.();
  }, [config]);

  // Auto-connect when config changes
  useEffect(() => {
    if (config.url) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [config.url, config.method]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    data,
    isConnected,
    lastUpdate,
    error,
    connect,
    disconnect,
    // Helper methods for specific data access
    getForwarders: () => data?.freight?.forwarders || [],
    getRoutes: () => data?.freight?.routes || [],
    getMarketData: () => data?.market,
    getCargoData: () => data?.cargo,
    getCorridorStatus: () => data?.corridors || [],
    // Data freshness indicators
    isDataFresh: (maxAgeMinutes: number = 5) => {
      if (!lastUpdate) return false;
      const ageMinutes = (Date.now() - lastUpdate.getTime()) / (1000 * 60);
      return ageMinutes <= maxAgeMinutes;
    }
  };
};

// Specialized hooks for different data types
export const useRealTimeFreightData = (url?: string) => {
  return useRealTimeInputAdapter({
    url,
    method: 'sse',
    onConnect: () => console.log('🚚 Freight data stream connected'),
    onError: (error) => console.error('🚚 Freight data error:', error)
  });
};

export const useRealTimeMarketData = (url?: string) => {
  return useRealTimeInputAdapter({
    url,
    method: 'polling',
    interval: 60000, // 1 minute for market data
    onConnect: () => console.log('📈 Market data polling started'),
    onError: (error) => console.error('📈 Market data error:', error)
  });
};

export const useRealTimeCorridorStatus = (url?: string) => {
  return useRealTimeInputAdapter({
    url,
    method: 'websocket',
    onConnect: () => console.log('🛣️ Corridor status stream connected'),
    onError: (error) => console.error('🛣️ Corridor status error:', error)
  });
};

export type { RealTimeConfig, RealTimeData };
