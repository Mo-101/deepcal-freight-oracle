
import React from 'react';
import DeepCALHeader from '@/components/DeepCALHeader';
import CalculatorLayout from '@/components/calculator/CalculatorLayout';

const SymbolicCalculator = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALHeader />
      <main className="container max-w-full mx-auto pt-6 px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">DeepCAL Symbolic Calculator</h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Advanced symbolic freight optimization using neutrosophic logic and multi-criteria decision analysis.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card shadow-glass border border-glassBorder p-6">
            <h2 className="text-xl font-semibold text-lime-400 mb-4">Symbolic Engine Status</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-indigo-200">Core Engine: Active</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-indigo-200">AHP-TOPSIS Matrix: Loaded</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-indigo-200">Neutrosophic Logic: Ready</span>
              </div>
            </div>
          </div>
          
          <div className="glass-card shadow-glass border border-glassBorder p-6">
            <h2 className="text-xl font-semibold text-lime-400 mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">105</div>
                <div className="text-sm text-indigo-300">Shipments Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.7%</div>
                <div className="text-sm text-indigo-300">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SymbolicCalculator;
