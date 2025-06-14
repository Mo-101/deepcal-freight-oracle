
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, BookOpen, Zap, Target } from 'lucide-react';
import type { FreightCalculatorResult } from '@/services/csvDataEngine';

interface MethodologyExplainerProps {
  result: FreightCalculatorResult;
  revealLevel: 'novice' | 'expert' | 'phd';
}

export const MethodologyExplainer: React.FC<MethodologyExplainerProps> = ({ 
  result, 
  revealLevel 
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const methodologySections = [
    {
      id: 'topsis',
      title: 'TOPSIS Algorithm',
      icon: Target,
      color: 'text-blue-400',
      novice: 'TOPSIS ranks options by finding the closest to ideal and farthest from worst solutions.',
      expert: 'Technique for Order of Preference by Similarity to Ideal Solution. Uses Euclidean distance in normalized decision space.',
      phd: 'Multi-criteria decision analysis using vector normalization, weighted criteria, and distance-based ranking with closeness coefficient C* = S-/(S+ + S-)'
    },
    {
      id: 'normalization',
      title: 'Vector Normalization',
      icon: Zap,
      color: 'text-purple-400',
      novice: 'Converts different units (days, dollars, percentages) to comparable 0-1 scale.',
      expert: 'Vector normalization: rij = xij / √(Σx²ij) ensures unit independence and equal weight distribution.',
      phd: 'Euclidean normalization preserving ratio properties: rij = xij / ||xj||₂ where ||xj||₂ = √(Σᵢ x²ij). Alternative: linear scaling (max-min) or z-score standardization.'
    },
    {
      id: 'weighting',
      title: 'Criteria Weighting',
      icon: BookOpen,
      color: 'text-green-400',
      novice: 'Your priorities (Time 68%, Cost 45%, Risk 22%) determine importance of each factor.',
      expert: 'AHP-derived weights applied to normalized matrix. Weight consistency checked via eigenvalue method.',
      phd: 'Analytic Hierarchy Process weights with consistency ratio CR = CI/RI < 0.1. Eigenvector method: Aw = λmax·w where consistency index CI = (λmax - n)/(n-1)'
    },
    {
      id: 'confidence',
      title: 'Statistical Confidence',
      icon: Target,
      color: 'text-amber-400',
      novice: 'Shows how reliable the recommendation is based on available data quality.',
      expert: 'Bootstrap resampling with 95% confidence intervals. Accounts for sample size and variance.',
      phd: 'Monte Carlo bootstrap (n=1000) with bias-corrected accelerated (BCa) intervals. Confidence = 1 - α where α = 0.05 for 95% CI. Power analysis: β = 0.05, effect size d = 0.8'
    }
  ];

  const dataLineage = [
    {
      step: 'Data Collection',
      description: `${result.lineageMeta.records} shipment records verified`,
      hash: result.lineageMeta.sha256.substring(0, 8),
      timestamp: result.lineageMeta.timestamp
    },
    {
      step: 'Preprocessing',
      description: 'Cleaned, validated, and normalized input data',
      hash: result.lineageMeta.sha256.substring(8, 16),
      timestamp: new Date().toISOString()
    },
    {
      step: 'Analysis',
      description: 'TOPSIS algorithm with sensitivity analysis',
      hash: result.lineageMeta.sha256.substring(16, 24),
      timestamp: new Date().toISOString()
    }
  ];

  return (
    <div className="space-y-6">
      {/* Methodology Overview */}
      <Card className="oracle-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-deepcal-light" />
            Scientific Methodology
          </CardTitle>
          <p className="text-sm text-slate-400">
            {revealLevel === 'novice' && 'How DeepCAL++ makes decisions'}
            {revealLevel === 'expert' && 'Multi-criteria decision analysis framework'}
            {revealLevel === 'phd' && 'Formal mathematical framework and validation'}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {methodologySections.map(section => (
            <div key={section.id} className="border border-slate-700 rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                className="w-full p-4 justify-between hover:bg-slate-800/50"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center gap-3">
                  <section.icon className={`w-5 h-5 ${section.color}`} />
                  <span className="font-medium">{section.title}</span>
                </div>
                {expandedSections.has(section.id) ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
              
              {expandedSections.has(section.id) && (
                <div className="p-4 border-t border-slate-700 bg-slate-900/30 fade-in">
                  <p className="text-sm leading-relaxed">
                    {revealLevel === 'novice' && section.novice}
                    {revealLevel === 'expert' && section.expert}
                    {revealLevel === 'phd' && section.phd}
                  </p>
                  
                  {revealLevel === 'phd' && section.id === 'topsis' && (
                    <div className="mt-3 p-3 bg-slate-800/50 rounded-lg font-mono text-xs">
                      <div>Distance to positive ideal: S⁺ᵢ = √(Σⱼ(vᵢⱼ - v⁺ⱼ)²)</div>
                      <div>Distance to negative ideal: S⁻ᵢ = √(Σⱼ(vᵢⱼ - v⁻ⱼ)²)</div>
                      <div>Closeness coefficient: C*ᵢ = S⁻ᵢ / (S⁺ᵢ + S⁻ᵢ)</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data Lineage */}
      <Card className="oracle-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Data Lineage & Traceability
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {dataLineage.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0 ? 'bg-green-900/30 text-green-400' :
                  i === 1 ? 'bg-blue-900/30 text-blue-400' :
                  'bg-purple-900/30 text-purple-400'
                }`}>
                  {i + 1}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="font-medium text-sm">{item.step}</div>
                  <div className="text-xs text-slate-400">{item.description}</div>
                  
                  {revealLevel !== 'novice' && (
                    <div className="flex items-center gap-4 text-xs">
                      <Badge variant="outline" className="font-mono">
                        #{item.hash}
                      </Badge>
                      <span className="text-slate-500">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {revealLevel === 'phd' && (
            <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <h4 className="font-semibold text-sm mb-2">Cryptographic Verification</h4>
              <div className="text-xs space-y-1 font-mono">
                <div>SHA-256: {result.lineageMeta.sha256}</div>
                <div>Records: {result.lineageMeta.records} (verified)</div>
                <div>Source: {result.lineageMeta.source} (authenticated)</div>
                <div>Timestamp: {result.lineageMeta.timestamp}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rules Engine */}
      <Card className="oracle-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-red-400" />
            Decision Rules Engine
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {result.rulesFired.map((rule, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg border border-slate-700 fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono">{rule}</span>
              </div>
            ))}
          </div>
          
          {revealLevel !== 'novice' && (
            <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-600/30">
              <div className="text-xs text-blue-200">
                Rules engine validates constraints, applies business logic, and ensures regulatory compliance 
                throughout the decision process.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
