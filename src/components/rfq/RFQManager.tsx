
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, FileText, Clock, CheckCircle } from 'lucide-react';

interface RFQ {
  id: string;
  title: string;
  status: 'draft' | 'sent' | 'responded' | 'awarded';
  origin: string;
  destination: string;
  createdAt: string;
  responses: number;
}

export const RFQManager: React.FC = () => {
  const [rfqs] = useState<RFQ[]>([
    {
      id: 'RFQ-001',
      title: 'Electronics shipment to Singapore',
      status: 'responded',
      origin: 'Los Angeles, USA',
      destination: 'Singapore',
      createdAt: '2024-01-15',
      responses: 5
    },
    {
      id: 'RFQ-002',
      title: 'Automotive parts to Germany',
      status: 'sent',
      origin: 'Detroit, USA',
      destination: 'Hamburg, Germany',
      createdAt: '2024-01-14',
      responses: 2
    },
    {
      id: 'RFQ-003',
      title: 'Textiles to Mexico',
      status: 'draft',
      origin: 'New York, USA',
      destination: 'Mexico City, Mexico',
      createdAt: '2024-01-13',
      responses: 0
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'sent': return 'bg-blue-500';
      case 'responded': return 'bg-green-500';
      case 'awarded': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="w-4 h-4" />;
      case 'sent': return <Clock className="w-4 h-4" />;
      case 'responded': return <CheckCircle className="w-4 h-4" />;
      case 'awarded': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">RFQ Management</h1>
        <Button className="bg-lime-500 hover:bg-lime-600 text-black">
          <Plus className="w-4 h-4 mr-2" />
          Create New RFQ
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" className="border-slate-600">
          <Search className="w-4 h-4 mr-2" />
          Search RFQs
        </Button>
        <Badge variant="outline" className="border-slate-600">
          {rfqs.length} Total RFQs
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rfqs.map((rfq) => (
          <Card key={rfq.id} className="glass-card shadow-glass border border-glassBorder">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white">{rfq.id}</CardTitle>
                <Badge className={`${getStatusColor(rfq.status)} text-white`}>
                  {getStatusIcon(rfq.status)}
                  <span className="ml-1 capitalize">{rfq.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-lime-400 mb-3">{rfq.title}</h3>
              <div className="space-y-2 text-sm text-indigo-300">
                <div>
                  <span className="font-medium">Origin:</span> {rfq.origin}
                </div>
                <div>
                  <span className="font-medium">Destination:</span> {rfq.destination}
                </div>
                <div>
                  <span className="font-medium">Created:</span> {rfq.createdAt}
                </div>
                <div>
                  <span className="font-medium">Responses:</span> {rfq.responses}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="border-slate-600 text-xs">
                  View Details
                </Button>
                {rfq.status === 'responded' && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                    Review Quotes
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-lime-400">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{rfqs.filter(r => r.status === 'draft').length}</div>
              <div className="text-sm text-indigo-300">Draft</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{rfqs.filter(r => r.status === 'sent').length}</div>
              <div className="text-sm text-indigo-300">Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{rfqs.filter(r => r.status === 'responded').length}</div>
              <div className="text-sm text-indigo-300">Responded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{rfqs.filter(r => r.status === 'awarded').length}</div>
              <div className="text-sm text-indigo-300">Awarded</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
