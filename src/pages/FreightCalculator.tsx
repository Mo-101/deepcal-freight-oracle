
import React from 'react';
import DeepCALHeader from '@/components/DeepCALHeader';
import CSVDataLoader from '@/components/CSVDataLoader';
import FreightCalculator from '@/components/FreightCalculator';
import { csvDataEngine } from '@/services/csvDataEngine';

const FreightCalculatorPage = () => {
  const isDataLoaded = csvDataEngine.isDataLoaded();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
      <DeepCALHeader />
      <main className="container mx-auto pt-6 px-4 space-y-8">
        {!isDataLoaded ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">DeepCAL Freight Calculator</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Revolutionary freight optimization using AHP-TOPSIS multi-criteria decision analysis.
                Load your data to unlock the full power of DeepCAL.
              </p>
            </div>
            <CSVDataLoader />
          </>
        ) : (
          <FreightCalculator />
        )}
      </main>
    </div>
  );
};

export default FreightCalculatorPage;
