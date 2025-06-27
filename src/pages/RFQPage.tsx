
import React from 'react';
import DeepCALSymbolicHeader from '@/components/DeepCALSymbolicHeader';
import { RFQManager } from '@/components/rfq/RFQManager';

export default function RFQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALSymbolicHeader />
      
      <div className="container max-w-full mx-auto py-6 px-6">
        <RFQManager />
      </div>
    </div>
  );
}
