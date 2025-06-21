
import React from 'react';
import DeepCALHeader from '@/components/DeepCALHeader';
import { RFQManager } from '@/components/rfq/RFQManager';

export default function RFQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALHeader />
      
      <div className="container max-w-full mx-auto py-6 px-6">
        <RFQManager />
      </div>
    </div>
  );
}
