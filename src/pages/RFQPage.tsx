import React from 'react';
import UnifiedGlassHeader from '@/components/UnifiedGlassHeader';
import { RFQManager } from '@/components/rfq/RFQManager';
import { CargoReadinessRFQForm } from '@/components/rfq/CargoReadinessRFQForm';
import { NewShipmentForm } from '@/components/rfq/NewShipmentForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Package, ClipboardList } from 'lucide-react';

export default function RFQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <UnifiedGlassHeader />
      
      <div className="container max-w-full mx-auto py-6 px-6">
        <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-lg mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-yellow-300 flex items-center gap-3">
              <ClipboardList className="w-8 h-8" />
              Data Management Center
            </CardTitle>
            <p className="text-slate-300">
              Manage RFQs and shipment data. All forms append to the base data (105+ records) - no mock data.
            </p>
          </CardHeader>
        </Card>

        <Tabs defaultValue="new-shipment" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
            <TabsTrigger 
              value="new-shipment" 
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black text-white"
            >
              <Package className="w-4 h-4 mr-2" />
              New Shipment
            </TabsTrigger>
            <TabsTrigger 
              value="rfq-form" 
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Cargo RFQ
            </TabsTrigger>
            <TabsTrigger 
              value="rfq-manager" 
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black text-white"
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              RFQ Manager
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="new-shipment" className="space-y-6">
            <NewShipmentForm />
          </TabsContent>
          
          <TabsContent value="rfq-form" className="space-y-6">
            <CargoReadinessRFQForm />
          </TabsContent>
          
          <TabsContent value="rfq-manager" className="space-y-6">
            <RFQManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
