
import { useState, useEffect } from 'react';
import { ForwarderRFQData } from "@/components/ForwarderRFQInputs";
import { ShipmentData } from '@/types/shipment';

export const useForwarderRFQ = () => {
  const [forwarderRFQ, setForwarderRFQ] = useState<Record<string, ForwarderRFQData>>({});

  const handleRFQChange = (forwarder: string, data: ForwarderRFQData) => {
    setForwarderRFQ(prev => ({
      ...prev,
      [forwarder]: data
    }));
  };

  const resetForwarderRFQ = () => {
    setForwarderRFQ({});
  };

  const populateRFQFromShipment = (shipment: ShipmentData): string[] => {
    const usedForwarders: string[] = [];
    const newForwarderRFQ: Record<string, ForwarderRFQData> = {};
    
    // Only add forwarders that have actual quote values
    if (shipment.kuehne_nagel && shipment.kuehne_nagel > 0) {
      usedForwarders.push('Kuehne + Nagel');
      newForwarderRFQ['Kuehne + Nagel'] = {
        rate: shipment.kuehne_nagel,
        days: shipment.transit_days || shipment.frieght_in_time || "",
        comments: ""
      };
    }
    
    if ((shipment.dhl_global && shipment.dhl_global > 0) || (shipment.dhl && shipment.dhl > 0)) {
      usedForwarders.push('DHL Global Forwarding');
      newForwarderRFQ['DHL Global Forwarding'] = {
        rate: shipment.dhl_global || shipment.dhl || 0,
        days: shipment.transit_days || shipment.frieght_in_time || "",
        comments: ""
      };
    }
    
    if ((shipment.scan_global_logistics && shipment.scan_global_logistics > 0) || (shipment.scan_global && shipment.scan_global > 0)) {
      usedForwarders.push('Scan Global Logistics');
      newForwarderRFQ['Scan Global Logistics'] = {
        rate: shipment.scan_global_logistics || shipment.scan_global || 0,
        days: shipment.transit_days || shipment.frieght_in_time || "",
        comments: ""
      };
    }
    
    if (shipment.siginon && shipment.siginon > 0) {
      usedForwarders.push('Siginon Logistics');
      newForwarderRFQ['Siginon Logistics'] = {
        rate: shipment.siginon,
        days: shipment.transit_days || shipment.frieght_in_time || "",
        comments: ""
      };
    }
    
    if ((shipment.agl && shipment.agl > 0) || (shipment.agility && shipment.agility > 0)) {
      usedForwarders.push('Agility Logistics');
      newForwarderRFQ['Agility Logistics'] = {
        rate: shipment.agl || shipment.agility || 0,
        days: shipment.transit_days || shipment.frieght_in_time || "",
        comments: ""
      };
    }

    setForwarderRFQ(newForwarderRFQ);
    return usedForwarders;
  };

  return {
    forwarderRFQ,
    handleRFQChange,
    resetForwarderRFQ,
    populateRFQFromShipment
  };
};
