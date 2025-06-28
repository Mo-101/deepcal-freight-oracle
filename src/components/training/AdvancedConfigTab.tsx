
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Settings, ChevronDown } from 'lucide-react';

export function AdvancedConfigTab() {
  return (
    <div className="space-y-6">
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-lime-400 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Advanced Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
              <span className="text-white font-medium">Neutrosophic Engine Parameters</span>
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 p-4 bg-slate-800/50 rounded-lg space-y-3">
              <div>
                <Label className="text-indigo-300">Truth Degree Threshold</Label>
                <Input type="number" defaultValue="0.75" className="mt-1" />
              </div>
              <div>
                <Label className="text-indigo-300">Indeterminacy Tolerance</Label>
                <Input type="number" defaultValue="0.15" className="mt-1" />
              </div>
              <div>
                <Label className="text-indigo-300">Falsity Rejection Level</Label>
                <Input type="number" defaultValue="0.10" className="mt-1" />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
              <span className="text-white font-medium">TOPSIS Configuration</span>
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 p-4 bg-slate-800/50 rounded-lg space-y-3">
              <div>
                <Label className="text-indigo-300">Distance Metric</Label>
                <select className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 mt-1">
                  <option>Euclidean Distance</option>
                  <option>Manhattan Distance</option>
                  <option>Minkowski Distance</option>
                </select>
              </div>
              <div>
                <Label className="text-indigo-300">Normalization Method</Label>
                <select className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 mt-1">
                  <option>Vector Normalization</option>
                  <option>Linear Normalization</option>
                  <option>Min-Max Normalization</option>
                </select>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
              <span className="text-white font-medium">Grey System Theory</span>
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 p-4 bg-slate-800/50 rounded-lg space-y-3">
              <div>
                <Label className="text-indigo-300">Grey Relation Resolution</Label>
                <Input type="number" defaultValue="0.5" step="0.1" className="mt-1" />
              </div>
              <div>
                <Label className="text-indigo-300">Whitening Weight Function</Label>
                <select className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 mt-1">
                  <option>Linear</option>
                  <option>Exponential</option>
                  <option>Logarithmic</option>
                </select>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
}
