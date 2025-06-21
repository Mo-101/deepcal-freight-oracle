
import React from 'react';
import UnifiedGlassHeader from '@/components/UnifiedGlassHeader';
import RealAnalytics from '@/components/RealAnalytics';

export default function Analytics() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <UnifiedGlassHeader />
      
      <div className="container max-w-full mx-auto py-6 px-6">
        <RealAnalytics />
      </div>
    </div>
  );
}
