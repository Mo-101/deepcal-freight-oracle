
import React, { useEffect, useState } from 'react';
import DeepCALHeader from '@/components/DeepCALHeader';
import CSVDataLoader from '@/components/CSVDataLoader';
import FreightCalculator from '@/components/FreightCalculator';
import { csvDataEngine } from '@/services/csvDataEngine';
import { humorToast } from '@/components/HumorToast';

const FreightCalculatorPage = () => {
  const [isDataLoaded, setIsDataLoaded] = useState(csvDataEngine.isDataLoaded());
  const [isAutoLoading, setIsAutoLoading] = useState(false);

  useEffect(() => {
    const autoLoadEmbeddedData = async () => {
      if (!csvDataEngine.isDataLoaded() && !isAutoLoading) {
        setIsAutoLoading(true);
        try {
          await csvDataEngine.autoLoadEmbeddedData();
          setIsDataLoaded(true);
          humorToast("🚀 DeepCAL Boot Complete", "Embedded dataset auto-loaded. No more locked features!", 3000);
        } catch (error) {
          console.error("Auto-load failed:", error);
          // Let user manually load data
        } finally {
          setIsAutoLoading(false);
        }
      }
    };

    autoLoadEmbeddedData();
  }, [isAutoLoading]);

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
                {isAutoLoading ? "Auto-loading embedded dataset..." : "Load your data to unlock the full power of DeepCAL."}
              </p>
            </div>
            {isAutoLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading embedded dataset...</p>
              </div>
            ) : (
              <CSVDataLoader onDataLoaded={() => setIsDataLoaded(true)} />
            )}
          </>
        ) : (
          <FreightCalculator />
        )}
      </main>
    </div>
  );
};

export default FreightCalculatorPage;
