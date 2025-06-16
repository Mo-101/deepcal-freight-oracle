
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Papa from 'papaparse';

export interface WeightVector {
  cost: number;
  time: number;
  reliability: number;
  risk: number;
}

const DEFAULT_WEIGHTS: WeightVector = {
  cost: 0.35,
  time: 0.35,
  reliability: 0.2,
  risk: 0.1,
};

/**
 * TEMPORARY placeholder - replace with your real shipment validator.
 * Should return an array of objects with .level property.
 */
function validateShipment(row: any) {
  // This stub simply marks all rows as "valid".
  return [{ level: "ok" }];
}

/**
 * TEMPORARY placeholder - replace with your real tnnToSentence function.
 */
function tnnToSentence(a: string, b: string, weights: number[]) {
  return `AHP Pairwise explanation for ${a} vs ${b} with weights [${weights.join(", ")}].`;
}

export default function TrainingPage() {
  const { toast } = useToast();
  const [weights, setWeights] = useState<WeightVector>(() => {
    const cached = localStorage.getItem('deepcal-weights');
    return cached ? JSON.parse(cached) : DEFAULT_WEIGHTS;
  });
  const [fileName, setFileName] = useState<string>('');
  const [rowCount, setRowCount] = useState<number>(0);
  const [matrixSentence, setMatrixSentence] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('deepcal-weights', JSON.stringify(weights));
  }, [weights]);

  const handleCsvUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as any[];
        const accepted = rows.filter((r) => validateShipment(r).every((a) => a.level !== 'error'));
        setRowCount(accepted.length);
        toast({ title: 'Training data loaded', description: `${accepted.length} valid rows` });
      },
    });
  };

  const handleSlider = (k: keyof WeightVector, v: number) => {
    const next = { ...weights, [k]: v / 100 } as WeightVector;
    const sum = Object.values(next).reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 1) > 0.0001) return; // keep sum==1
    setWeights(next);
  };

  const computeSentence = () => {
    const pair = tnnToSentence('Cost', 'Time', [4, 5, 6]);
    setMatrixSentence(pair);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <div className="container max-w-5xl mx-auto py-10 px-4">
        {/* Professional Dashboard/Section Header */}
        <header className="mb-10">
          <h1 className="section-title flex items-center gap-3 text-white">
            <span className="block w-7 h-7 rounded-full bg-lime-400 flex items-center justify-center text-slate-900 text-lg font-bold shadow-glass">T</span>
            DeepCAL++ Symbolic Training
          </h1>
          <p className="subtle-text mt-2 font-medium text-indigo-200">
            Upload real-world shipment data, fine-tune analytic model criteria, and generate human-readable explanations — with full integrity.
          </p>
        </header>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* CSV loader */}
          <Card className="glass-card shadow-glass border border-glassBorder">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-lime-400 tracking-tight">Training Dataset</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="csv-upload" className="input-label block mb-2 text-indigo-300">Upload .csv file</Label>
                <Input id="csv-upload" type="file" accept=".csv" className="elegant-input" onChange={handleCsvUpload} />
              </div>
              {fileName && (
                <div className="text-sm flex flex-col gap-1">
                  <span className="font-mono text-lime-400">{fileName}</span>
                  <span className="text-indigo-300">{rowCount} valid rows</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Criteria Weights */}
          <Card className="glass-card shadow-glass border border-glassBorder">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-lime-400 tracking-tight">Criteria Weights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="text-sm text-indigo-300 mb-2">
                All weights must total <span className="font-mono text-lime-400">100%</span>.
              </div>
              {(['cost', 'time', 'reliability', 'risk'] as (keyof WeightVector)[]).map((k) => (
                <div key={k} className="space-y-1">
                  <Label htmlFor={k} className="input-label text-indigo-300">{k.charAt(0).toUpperCase() + k.slice(1)}</Label>
                  <input
                    id={k}
                    type="range"
                    min={0}
                    max={100}
                    value={weights[k] * 100}
                    onChange={(e) => handleSlider(k, Number(e.target.value))}
                    className="w-full accent-lime-400 rounded-lg"
                  />
                  <span className="text-xs text-indigo-300 ml-2">{(weights[k] * 100).toFixed(0)}%</span>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={computeSentence} className="bg-lime-400 hover:bg-lime-500 text-slate-900 px-6 py-2 text-base font-semibold">
                Explain AHP Pair
              </Button>
            </CardFooter>
          </Card>
        </div>
        {/* Explanation */}
        <Card className="glass-card shadow-glass border border-glassBorder mt-10">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-lime-400 tracking-tight">
              Natural-language Explanation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {matrixSentence ? (
              <p className="text-base font-medium text-white">{matrixSentence}</p>
            ) : (
              <p className="text-sm text-indigo-300">Click <span className="font-semibold text-lime-400">"Explain AHP Pair"</span> to generate an example sentence.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
