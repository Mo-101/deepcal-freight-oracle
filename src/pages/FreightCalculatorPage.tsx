
import React, { useEffect, useState } from 'react';
import DeepCALHeader from '@/components/DeepCALHeader';
import CSVDataLoader from '@/components/CSVDataLoader';
import FreightCalculator from '@/components/FreightCalculator';
import { csvDataEngine } from '@/services/csvDataEngine';
import { humorToast } from '@/components/HumorToast';

const FreightCalculatorPage = () => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isAutoLoading, setIsAutoLoading] = useState(false);

  useEffect(() => {
    const autoLoadEmbeddedData = async () => {
      const isLoaded = await csvDataEngine.isDataLoaded();
      if (!isLoaded && !isAutoLoading) {
        setIsAutoLoading(true);
        try {
          await csvDataEngine.autoLoadEmbeddedData();
          setIsDataLoaded(true);
          humorToast("🚀 DeepCAL Boot Complete", "Embedded dataset auto-loaded. No more locked features!", 3000);
        } catch (error) {
          console.error("Auto-load failed:", error);
        } finally {
          setIsAutoLoading(false);
        }
      } else {
        setIsDataLoaded(isLoaded);
      }
    };

    autoLoadEmbeddedData();
  }, [isAutoLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALHeader />
      <main className="container max-w-full mx-auto pt-6 px-6 space-y-8">
        {!isDataLoaded ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 text-white">DeepCAL Freight Calculator</h1>
              <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
                Revolutionary freight optimization using AHP-TOPSIS multi-criteria decision analysis.
                {isAutoLoading ? "Auto-loading embedded dataset..." : "Load your data to unlock the full power of DeepCAL."}
              </p>
            </div>
            {isAutoLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
                <p className="text-indigo-200">Loading embedded dataset...</p>
              </div>
            ) : (
              <CSVDataLoader onDataLoaded={() => setIsDataLoaded(true)} />
            )}
          </div>
        ) : (
          <FreightCalculator />
        )}
      </main>
    </div>
  );
};

export default FreightCalculatorPage;
