
import React from 'react';
import { Calculator, Database } from 'lucide-react';

interface FreightCalculatorHeaderProps {
  lineageMeta: any;
}

export const FreightCalculatorHeader: React.FC<FreightCalculatorHeaderProps> = ({ lineageMeta }) => {
  return (
    <div className="text-center mb-3">
      <h1 className="section-title flex items-center justify-center gap-3 mb-2 text-white">
        <Calculator className="w-8 h-8 text-primary" />
        DeepCAL™ Advanced Freight Calculator
      </h1>
      <p className="subtle-text text-white">
        Neutrosophic AHP-TOPSIS Decision Framework for multi-carrier optimization powered by real data.
      </p>
      {lineageMeta && (
        <div className="mt-2 text-xs text-accent flex items-center justify-center gap-2">
          <Database className="w-4 h-4" />
          {lineageMeta.records} real records • {lineageMeta.source} • Hash: {lineageMeta.sha256.substring(0, 8)}
        </div>
      )}
    </div>
  );
};
