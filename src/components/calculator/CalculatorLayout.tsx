
import React from 'react';
import DeepCALSymbolicHeader from '@/components/DeepCALSymbolicHeader';

interface CalculatorLayoutProps {
  children: React.ReactNode;
}

const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-space-grotesk" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <DeepCALSymbolicHeader />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>

      <footer className="py-6 px-4 border-t border-slate-700 mt-8">
        <div className="container mx-auto text-center">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-8">
            <div>
              <i className="fas fa-brain text-deepcal-light mr-2"></i>
              PHASE I – Power Analytical Engine (ACTIVE)
            </div>
            <div>
              <i className="fas fa-chart-network text-deepcal-light mr-2"></i>
              PHASE II – Neural Visualization (Q2 2025)
            </div>
            <div>
              <i className="fas fa-wave-square text-deepcal-light mr-2"></i>
              PHASE III – DeepTalk Voice (Q3 2025)
            </div>
            <div>
              <i className="fas fa-bolt text-deepcal-light mr-2"></i>
              PHASE IV – Live Integration (Q4 2025)
            </div>
          </div>
          <div className="mt-6 text-xs text-slate-500">
            © 2025 DeepCAL++ Technologies • The First Symbolic Logistical Intelligence Engine • 🔱
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CalculatorLayout;
