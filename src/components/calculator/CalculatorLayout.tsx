import React from 'react';
import DeepCALHeader from '@/components/DeepCALHeader';

interface CalculatorLayoutProps {
  children: React.ReactNode;
}

export default function CalculatorLayout({ children }: CalculatorLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALHeader />
      <main className="container max-w-full mx-auto py-6 px-6">
        <div className="space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}