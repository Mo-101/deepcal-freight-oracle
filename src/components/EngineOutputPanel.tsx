
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp } from 'lucide-react';

export const EngineOutputPanel: React.FC = () => {
  return (
    <div className="w-full">
      <Card className="glass-card border-2 border-white/30 bg-white/10 shadow-cosmic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="w-5 h-5" />
            DeepCAL™ Engine Output
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-white/70">
            <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Enter shipment details and click Calculate to see recommendations</p>
            <p className="text-xs mt-2">All calculations use real data - no mock values!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
