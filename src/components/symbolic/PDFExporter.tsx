
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, FileText } from 'lucide-react';
import { SymbolicResult } from '@/hooks/useSymbolicIntelligence';

interface PDFExporterProps {
  result: SymbolicResult | null;
  disabled: boolean;
}

export const PDFExporter: React.FC<PDFExporterProps> = ({ result, disabled }) => {
  const generateReport = () => {
    if (!result) return;

    const reportContent = `
DEEPCAL SYMBOLIC LOGISTICS ANALYSIS REPORT
==========================================

Generated: ${new Date().toLocaleString()}
Processing Time: ${result.processingTime}ms
Confidence Level: ${(result.confidence * 100).toFixed(1)}%

OPTIMAL SOLUTION
===============
${result.bestAlternative.name}

Cost: $${typeof result.bestAlternative.cost === 'number' ? 
  result.bestAlternative.cost.toLocaleString() : 
  (result.bestAlternative.cost as any)?.value?.toLocaleString() || 'Variable'}

Time: ${typeof result.bestAlternative.time === 'number' ? 
  result.bestAlternative.time : 
  (result.bestAlternative.time as any)?.value || 'Variable'} days

Reliability: ${(Number(result.bestAlternative.reliability) * 100).toFixed(0)}%
Risk Level: ${(Number(result.bestAlternative.risk) * 100).toFixed(0)}%

COMPLETE RANKING
===============
${result.ranking.map((item, index) => `
${index + 1}. ${item.alternative.name}
   TOPSIS Score: ${item.score.toFixed(3)}
   Distance to Ideal: ${item.distanceToIdeal.toFixed(3)}
   Distance to Anti-Ideal: ${item.distanceToAntiIdeal.toFixed(3)}
`).join('')}

SYMBOLIC METHODOLOGY
===================
${result.methodology}

VALIDATED RULES
==============
${result.validRules.map(rule => `
• ${rule.rule}
  Truth: ${rule.truth.toFixed(3)} | Indeterminacy: ${rule.indeterminacy.toFixed(3)} | Falsity: ${rule.falsity.toFixed(3)}
  Category: ${rule.category}
`).join('')}

SYSTEM SIGNATURE
===============
DeepCAL v2.1 - First Symbolic Logistics Intelligence
"Not built for applause. Built for service."
© 2025 DeepCAL Neural Mind - Symbolic Intelligence for Africa
    `;

    // Create and download the report
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DeepCAL_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={generateReport}
        disabled={disabled || !result}
        variant="outline"
        size="sm"
        className="border-slate-600 text-slate-300 hover:bg-slate-700"
      >
        <FileDown className="w-4 h-4 mr-2" />
        Export Report
      </Button>
      
      {result && (
        <Button
          onClick={() => window.print()}
          disabled={disabled}
          variant="outline"
          size="sm"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <FileText className="w-4 h-4 mr-2" />
          Print
        </Button>
      )}
    </div>
  );
};
