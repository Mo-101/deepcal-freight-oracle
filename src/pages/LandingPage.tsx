import React from 'react';
import UnifiedGlassHeader from '@/components/UnifiedGlassHeader';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <UnifiedGlassHeader />
      
      <div className="container max-w-6xl mx-auto py-12 px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
            DeepCAL
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            The Neural Oracle of Freight Intelligence
          </p>
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
            Advanced AI-powered logistics optimization with neutrosophic decision theory, 
            real-time market intelligence, and symbolic reasoning.
          </p>
        </div>
      </div>
    </div>
  );
}
