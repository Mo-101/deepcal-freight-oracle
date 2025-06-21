
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Network, 
  Globe, 
  MapPin, 
  Truck, 
  Ship, 
  Plane,
  RefreshCw,
  Zap
} from 'lucide-react';

interface GraphNode {
  id: string;
  type: 'port' | 'city' | 'warehouse' | 'airport';
  name: string;
  country: string;
  connections: number;
  importance: number;
  active: boolean;
  coordinates: { x: number; y: number };
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
  type: 'sea' | 'air' | 'road' | 'rail';
  weight: number;
  capacity: number;
  active: boolean;
}

export function GraphNeuralNetworkPanel() {
  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: 'SHA', type: 'port', name: 'Shanghai', country: 'CN', connections: 12, importance: 0.95, active: true, coordinates: { x: 80, y: 40 } },
    { id: 'SIN', type: 'port', name: 'Singapore', country: 'SG', connections: 15, importance: 0.92, active: true, coordinates: { x: 75, y: 65 } },
    { id: 'RTM', type: 'port', name: 'Rotterdam', country: 'NL', connections: 10, importance: 0.88, active: true, coordinates: { x: 45, y: 25 } },
    { id: 'LAX', type: 'airport', name: 'Los Angeles', country: 'US', connections: 8, importance: 0.85, active: true, coordinates: { x: 15, y: 45 } },
    { id: 'DXB', type: 'airport', name: 'Dubai', country: 'AE', connections: 14, importance: 0.90, active: true, coordinates: { x: 60, y: 50 } },
    { id: 'FRA', type: 'airport', name: 'Frankfurt', country: 'DE', connections: 11, importance: 0.87, active: true, coordinates: { x: 48, y: 28 } },
    { id: 'NYC', type: 'city', name: 'New York', country: 'US', connections: 9, importance: 0.89, active: false, coordinates: { x: 25, y: 35 } },
    { id: 'LOS', type: 'port', name: 'Lagos', country: 'NG', connections: 6, importance: 0.72, active: false, coordinates: { x: 42, y: 70 } }
  ]);

  const [edges, setEdges] = useState<GraphEdge[]>([
    { id: 'SHA-SIN', from: 'SHA', to: 'SIN', type: 'sea', weight: 0.8, capacity: 95, active: true },
    { id: 'SIN-DXB', from: 'SIN', to: 'DXB', type: 'sea', weight: 0.7, capacity: 88, active: true },
    { id: 'DXB-RTM', from: 'DXB', to: 'RTM', type: 'sea', weight: 0.9, capacity: 92, active: true },
    { id: 'LAX-SHA', from: 'LAX', to: 'SHA', type: 'air', weight: 0.6, capacity: 78, active: true },
    { id: 'FRA-NYC', from: 'FRA', to: 'NYC', type: 'air', weight: 0.85, capacity: 91, active: false },
    { id: 'RTM-LOS', from: 'RTM', to: 'LOS', type: 'sea', weight: 0.4, capacity: 65, active: false }
  ]);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [graphMetrics, setGraphMetrics] = useState({
    nodeEmbeddings: 94.2,
    edgeWeights: 87.5,
    pathOptimization: 91.8,
    networkDensity: 0.73
  });

  useEffect(() => {
    if (isOptimizing) {
      const interval = setInterval(() => {
        setNodes(prev => prev.map(node => ({
          ...node,
          importance: Math.max(0.1, Math.min(1.0, node.importance + (Math.random() - 0.5) * 0.05)),
          active: node.importance > 0.7
        })));

        setEdges(prev => prev.map(edge => ({
          ...edge,
          weight: Math.max(0.1, Math.min(1.0, edge.weight + (Math.random() - 0.5) * 0.03)),
          active: edge.weight > 0.5
        })));

        setGraphMetrics(prev => ({
          nodeEmbeddings: Math.max(85, Math.min(99, prev.nodeEmbeddings + (Math.random() - 0.5) * 2)),
          edgeWeights: Math.max(80, Math.min(95, prev.edgeWeights + (Math.random() - 0.5) * 1.5)),
          pathOptimization: Math.max(88, Math.min(98, prev.pathOptimization + (Math.random() - 0.5) * 1)),
          networkDensity: Math.max(0.6, Math.min(0.9, prev.networkDensity + (Math.random() - 0.5) * 0.02))
        }));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isOptimizing]);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'port': return <Ship className="w-3 h-3" />;
      case 'airport': return <Plane className="w-3 h-3" />;
      case 'city': return <MapPin className="w-3 h-3" />;
      case 'warehouse': return <Truck className="w-3 h-3" />;
      default: return <Globe className="w-3 h-3" />;
    }
  };

  const getEdgeColor = (type: string) => {
    switch (type) {
      case 'sea': return 'stroke-blue-400';
      case 'air': return 'stroke-purple-400';
      case 'road': return 'stroke-green-400';
      case 'rail': return 'stroke-yellow-400';
      default: return 'stroke-gray-400';
    }
  };

  return (
    <Card className="glass-card shadow-glass border border-glassBorder">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-lime-400 flex items-center gap-2">
          <Network className="w-5 h-5" />
          Graph Neural Network
          <Badge className="bg-blue-900 text-blue-300">Logistics Graph</Badge>
        </CardTitle>
        <p className="text-indigo-300 text-sm">
          Global shipping network optimization using graph embeddings and path analysis
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Network Visualization */}
        <div className="relative">
          <h4 className="text-lime-400 font-medium mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Network Topology
          </h4>
          <div className="relative bg-slate-900/50 rounded-lg p-4 h-64 overflow-hidden">
            <svg width="100%" height="100%" className="absolute inset-0">
              {/* Edges */}
              {edges.map((edge) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                
                return (
                  <line
                    key={edge.id}
                    x1={`${fromNode.coordinates.x}%`}
                    y1={`${fromNode.coordinates.y}%`}
                    x2={`${toNode.coordinates.x}%`}
                    y2={`${toNode.coordinates.y}%`}
                    className={`${getEdgeColor(edge.type)} ${
                      edge.active ? 'opacity-80' : 'opacity-20'
                    }`}
                    strokeWidth={edge.active ? edge.weight * 3 : 1}
                    strokeDasharray={edge.active ? 'none' : '5,5'}
                  />
                );
              })}
              
              {/* Nodes */}
              {nodes.map((node) => (
                <g key={node.id}>
                  <circle
                    cx={`${node.coordinates.x}%`}
                    cy={`${node.coordinates.y}%`}
                    r={node.importance * 8 + 4}
                    className={`${
                      node.active 
                        ? 'fill-lime-400 animate-pulse' 
                        : 'fill-gray-500'
                    }`}
                    opacity={node.active ? 0.8 : 0.4}
                  />
                  <text
                    x={`${node.coordinates.x}%`}
                    y={`${node.coordinates.y + 8}%`}
                    textAnchor="middle"
                    className="fill-white text-xs font-mono"
                  >
                    {node.id}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Node Analysis */}
        <div>
          <h4 className="text-lime-400 font-medium mb-3">Node Importance Ranking</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {nodes
              .sort((a, b) => b.importance - a.importance)
              .map((node) => (
                <div 
                  key={node.id}
                  className={`flex items-center justify-between p-2 rounded border ${
                    node.active 
                      ? 'bg-lime-900/20 border-lime-500/30' 
                      : 'bg-slate-800/30 border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded ${
                      node.active ? 'bg-lime-600' : 'bg-gray-600'
                    }`}>
                      {getNodeIcon(node.type)}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{node.name}</div>
                      <div className="text-xs text-indigo-300">{node.country} • {node.connections} connections</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lime-400 font-mono text-sm">
                      {(node.importance * 100).toFixed(1)}%
                    </div>
                    <Badge 
                      variant={node.active ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {node.active ? 'Active' : 'Dormant'}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Training Controls */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsOptimizing(!isOptimizing)}
            className={`flex-1 ${
              isOptimizing 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isOptimizing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            {isOptimizing ? 'Stop Optimization' : 'Start Graph Training'}
          </Button>
        </div>

        {/* Graph Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-indigo-300 text-sm">Node Embeddings</span>
              <span className="text-lime-400 text-sm">{graphMetrics.nodeEmbeddings.toFixed(1)}%</span>
            </div>
            <Progress value={graphMetrics.nodeEmbeddings} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-indigo-300 text-sm">Edge Weights</span>
              <span className="text-lime-400 text-sm">{graphMetrics.edgeWeights.toFixed(1)}%</span>
            </div>
            <Progress value={graphMetrics.edgeWeights} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-indigo-300 text-sm">Path Optimization</span>
              <span className="text-lime-400 text-sm">{graphMetrics.pathOptimization.toFixed(1)}%</span>
            </div>
            <Progress value={graphMetrics.pathOptimization} className="h-2" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{graphMetrics.networkDensity.toFixed(2)}</div>
            <div className="text-xs text-indigo-300">Network Density</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
