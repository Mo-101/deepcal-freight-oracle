
import React from 'react';
import DeepCALSymbolicHeader from '@/components/DeepCALSymbolicHeader';

interface CalculatorLayoutProps {
  children: React.ReactNode;
}

const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-space-grotesk" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <DeepCALSymbolicHeader />
      
      <main className="flex-1 py-4 sm:py-8">
        <div className="container mx-auto px-2 sm:px-4">
          {children}
        </div>
      </main>

      <footer className="py-4 sm:py-6 px-2 sm:px-4 border-t border-slate-700 mt-6 sm:mt-8">
        <div className="container mx-auto text-center">
          <div className="flex flex-col lg:flex-row justify-center items-center space-y-2 lg:space-y-0 lg:space-x-6 text-xs sm:text-sm">
            <div className="flex items-center">
              <i className="fas fa-brain text-deepcal-light mr-1 sm:mr-2"></i>
              <span className="hidden sm:inline">PHASE I – Power Analytical Engine (ACTIVE)</span>
              <span className="sm:hidden">Phase I - Active</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-chart-network text-deepcal-light mr-1 sm:mr-2"></i>
              <span className="hidden sm:inline">PHASE II – Neural Visualization (Q2 2025)</span>
              <span className="sm:hidden">Phase II - Q2 2025</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-wave-square text-deepcal-light mr-1 sm:mr-2"></i>
              <span className="hidden sm:inline">PHASE III – DeepTalk Voice (Q3 2025)</span>
              <span className="sm:hidden">Phase III - Q3 2025</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-bolt text-deepcal-light mr-1 sm:mr-2"></i>
              <span className="hidden sm:inline">PHASE IV – Live Integration (Q4 2025)</span>
              <span className="sm:hidden">Phase IV - Q4 2025</span>
            </div>
          </div>
          <div className="mt-3 sm:mt-6 text-xs text-slate-500">
            © 2025 DeepCAL++ Technologies • The First Symbolic Logistical Intelligence Engine • 🔱
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CalculatorLayout;
