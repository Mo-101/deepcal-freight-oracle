
import { useState, useEffect } from 'react';
import { csvDataEngine } from '@/services/csvDataEngine';
import { humorToast } from '@/components/HumorToast';
import { ShipmentData } from '@/types/shipment';

export const useShipmentData = () => {
  const [shipments, setShipments] = useState<ShipmentData[]>([]);
  const [selectedReference, setSelectedReference] = useState<string | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentData | null>(null);
  const [dataStale, setDataStale] = useState(false);
  const [refreshingData, setRefreshingData] = useState(false);

  const handleRefreshData = async () => {
    setRefreshingData(true);
    try {
      await csvDataEngine.forceReloadEmbeddedData();
      const freshRecords = await csvDataEngine.listShipments();
      
      // Convert ShipmentRecord[] to ShipmentData[]
      const convertedData: ShipmentData[] = freshRecords.map(record => ({
        ...record,
        weight_kg: record.weight_kg || 0,
        volume_cbm: record.volume_cbm || 0,
        item_value: typeof record.item_value === 'string' ? parseFloat(record.item_value) || 0 : (record.item_value || 0),
        'carrier+cost': typeof record['carrier+cost'] === 'string' ? parseFloat(record['carrier+cost']) || 0 : (record['carrier+cost'] || 0)
      }));
      
      setShipments(convertedData);
      setDataStale(false);
      
      // Clear selection
      setSelectedReference(null);
      setSelectedShipment(null);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      humorToast("❌ Refresh Failed", "Could not reload fresh data from CSV", 3000);
    } finally {
      setRefreshingData(false);
    }
  };

  // Load shipments effect
  useEffect(() => {
    const fetchShipments = async () => {
      const shipmentRecords = await csvDataEngine.listShipments();
      
      // Convert ShipmentRecord[] to ShipmentData[]
      const convertedData: ShipmentData[] = shipmentRecords.map(record => ({
        ...record,
        weight_kg: record.weight_kg || 0,
        volume_cbm: record.volume_cbm || 0,
        item_value: typeof record.item_value === 'string' ? parseFloat(record.item_value) || 0 : (record.item_value || 0),
        'carrier+cost': typeof record['carrier+cost'] === 'string' ? parseFloat(record['carrier+cost']) || 0 : (record['carrier+cost'] || 0)
      }));
      
      setShipments(convertedData);
      
      const isStale = await csvDataEngine.isDataStale();
      setDataStale(isStale);
    };
    fetchShipments();
  }, []);

  // Update selected shipment when reference changes
  useEffect(() => {
    if (!selectedReference) {
      setSelectedShipment(null);
      return;
    }
    
    const shipment = shipments.find((s) => s.request_reference === selectedReference);
    if (shipment) {
      console.log('Selected shipment data:', shipment);
      setSelectedShipment(shipment);
    }
  }, [selectedReference, shipments]);

  return {
    shipments,
    selectedReference,
    setSelectedReference,
    selectedShipment,
    dataStale,
    refreshingData,
    handleRefreshData
  };
};
