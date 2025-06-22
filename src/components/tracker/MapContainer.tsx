import React, { forwardRef, useEffect, useRef } from 'react';
import { MapPin, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';

interface MapContainerProps {
  routePoints: {
    lat: number;
    lng: number;
    timestamp: Date;
    status: 'in-transit' | 'checkpoint' | 'delay' | 'completed';
  }[];
  currentPosition: GeolocationPosition | null;
}

export const MapContainer = forwardRef<any, MapContainerProps>(({ routePoints, currentPosition }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw cyberpunk grid background
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.lineWidth = 1;
    const gridSize = 20;
    
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw route path
    if (routePoints.length > 1) {
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Scale coordinates to fit canvas
      const minLat = Math.min(...routePoints.map(p => p.lat));
      const maxLat = Math.max(...routePoints.map(p => p.lat));
      const minLng = Math.min(...routePoints.map(p => p.lng));
      const maxLng = Math.max(...routePoints.map(p => p.lng));
      
      routePoints.forEach((point, i) => {
        const x = ((point.lng - minLng) / (maxLng - minLng)) * canvas.width;
        const y = ((point.lat - minLat) / (maxLat - minLat)) * canvas.height;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      // Draw points
      routePoints.forEach((point, i) => {
        const x = ((point.lng - minLng) / (maxLng - minLng)) * canvas.width;
        const y = ((point.lat - minLat) / (maxLat - minLat)) * canvas.height;
        
        // Draw point
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = getStatusColor(point.status);
        ctx.fill();
        
        // Draw pulse effect for current position
        if (i === routePoints.length - 1) {
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.strokeStyle = getStatusColor(point.status);
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    }
    
    // Draw current position if available
    if (currentPosition) {
      const x = ((currentPosition.coords.longitude - minLng) / (maxLng - minLng)) * canvas.width;
      const y = ((currentPosition.coords.latitude - minLat) / (maxLat - minLat)) * canvas.height;
      
      // Draw animated position marker
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.fill();
      
      // Draw pulsing ring
      const pulseSize = 12 + Math.sin(Date.now() / 300) * 4;
      ctx.beginPath();
      ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [routePoints, currentPosition]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checkpoint': return '#10b981';
      case 'delay': return '#ef4444';
      case 'completed': return '#8b5cf6';
      default: return '#06b6d4';
    }
  };
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full bg-slate-900"
    />
  );
});

MapContainer.displayName = 'MapContainer';
