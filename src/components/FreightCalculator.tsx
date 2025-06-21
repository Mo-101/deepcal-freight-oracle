
import React, { useState, useEffect } from 'react';
import { csvDataEngine, ShipmentRecord } from '@/services/csvDataEngine';
import { humorToast } from '@/components/HumorToast';
import { fire } from "@/moscripts/engine";
import { FreightCalculatorHeader } from './FreightCalculatorHeader';
import { ReferenceShipmentSelector } from './calculator/ReferenceShipmentSelector';
import { ShipmentDetailsForm } from './ShipmentDetailsForm';
import { EngineOutputPanel } from './EngineOutputPanel';

interface CalculatorInputs {
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  urgency: 'medium' | 'high';
  cargoType: string;
}

const FreightCalculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    origin: '',
    destination: '',
    weight: 0,
    volume: 0,
    urgency: 'medium',
    cargoType: ''
  });
  const [calculating, setCalculating] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [oldShipments, setOldShipments] = useState<ShipmentRecord[]>([]);
  const [selectedReference, setSelectedReference] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const shipments = await csvDataEngine.listShipments();
      setDataLoaded(Array.isArray(shipments) && shipments.length > 0);
      setOldShipments(shipments);
    })();
  }, []);

  useEffect(() => {
    if (selectedReference) {
      const found = oldShipments.find(s => s.request_reference === selectedReference);
      if (found) {
        setInputs({
          origin: found.origin_country ?? "",
          destination: found.destination_country ?? "",
          weight: found.weight_kg ?? 0,
          volume: found.volume_cbm ?? 0,
          urgency: 'medium',
          cargoType: found.item_category ?? "",
        });
      }
    }
  }, [selectedReference, oldShipments]);

  const handleCalculate = async () => {
    fire("onBeforeSaveShipment", {
      shipment: {
        ...inputs,
      },
    });
    humorToast("❌ Calculation Engine Disabled", "Calculation methods have been decoupled from loader; scoring coming via @deepcal/core-mcdm.", 3000);
  };

  const clearForm = () => {
    setInputs({
      origin: '',
      destination: '',
      weight: 0,
      volume: 0,
      urgency: 'medium',
      cargoType: ''
    });
    setSelectedReference(null);
  };

  const lineageMeta = csvDataEngine.getLineageMeta?.();

  return (
    <div className="max-w-6xl mx-auto space-y-8 page-transition font-elegant">
      <FreightCalculatorHeader lineageMeta={lineageMeta} />
      
      <ReferenceShipmentSelector
        selectedReference={selectedReference}
        oldShipments={oldShipments}
        onReferenceChange={setSelectedReference}
        onClear={clearForm}
      />

      <ShipmentDetailsForm
        inputs={inputs}
        setInputs={setInputs}
        calculating={calculating}
        dataLoaded={dataLoaded}
        onCalculate={handleCalculate}
        onClearForm={clearForm}
      />

      <EngineOutputPanel />
    </div>
  );
};

export default FreightCalculator;
