
import React from 'react';
import { useSymbolicCalculator } from '@/hooks/useSymbolicCalculator';
import CalculatorLayout from '@/components/calculator/CalculatorLayout';
import DataStalenessWarning from '@/components/calculator/DataStalenessWarning';
import ReferenceShipmentSelector from '@/components/calculator/ReferenceShipmentSelector';
import ShipmentConfigurationPanel from '@/components/calculator/ShipmentConfigurationPanel';
import OracleResultsPanel from '@/components/calculator/OracleResultsPanel';
import MagicalOverlay from '@/components/calculator/MagicalOverlay';

const SymbolicCalculator = () => {
  const {
    inputs,
    setInputs,
    shipments,
    selectedReference,
    setSelectedReference,
    selectedShipment,
    forwarderRFQ,
    results,
    isAwakening,
    showOutput,
    outputAnimation,
    anomalyMap,
    dataStale,
    refreshingData,
    validation,
    handlePrioritiesChange,
    handleForwarderToggle,
    handleRFQChange,
    awakenOracle,
    handleRefreshData
  } = useSymbolicCalculator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <CalculatorLayout>
        <DataStalenessWarning 
          dataStale={dataStale}
          refreshingData={refreshingData}
          onRefresh={handleRefreshData}
        />

        <ReferenceShipmentSelector
          selectedReference={selectedReference}
          oldShipments={shipments}
          refreshingData={refreshingData}
          dataStale={dataStale}
          onReferenceChange={setSelectedReference}
          onRefresh={handleRefreshData}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ShipmentConfigurationPanel
              inputs={inputs}
              validation={validation}
              forwarderRFQ={forwarderRFQ}
              isAwakening={isAwakening}
              shipments={shipments}
              onInputsChange={setInputs}
              onPrioritiesChange={handlePrioritiesChange}
              onForwarderToggle={handleForwarderToggle}
              onRFQChange={handleRFQChange}
              onAwakenOracle={awakenOracle}
            />
          </div>
          
          <div className={`lg:col-span-2 space-y-6`}>
            {/* Oracle Results Panel with integrated flight intelligence */}
            <div className="relative min-h-[300px] flex items-center justify-center">
              <OracleResultsPanel
                showOutput={showOutput}
                outputAnimation={outputAnimation}
                results={results}
                selectedShipment={selectedShipment}
                anomalyMap={anomalyMap}
                inputs={inputs}
              />
              
              <MagicalOverlay 
                showOutput={showOutput}
                outputAnimation={outputAnimation}
              />
            </div>
          </div>
        </div>
      </CalculatorLayout>
    </div>
  );
};

export default SymbolicCalculator;
