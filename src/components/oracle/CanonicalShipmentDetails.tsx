
import React from "react";

interface CanonicalShipmentDetailsProps {
  inputs: {
    origin: string;
    destination: string;
    weight: number;
    volume: number;
    cargoType: string;
    priorities: {
      time: number;
      cost: number;
      risk: number;
    };
    selectedForwarders: string[];
  } | null;
}

const CanonicalShipmentDetails: React.FC<CanonicalShipmentDetailsProps> = ({ inputs }) => (
  <div className="oracle-card p-6 h-full">
    <h2 className="text-xl font-semibold mb-6 text-deepcal-light">
      Canonical Shipment Details
    </h2>
    {inputs ? (
      <div className="space-y-3">
        <div><b>Origin:</b> {inputs.origin}</div>
        <div><b>Destination:</b> {inputs.destination}</div>
        <div><b>Weight (kg):</b> {inputs.weight}</div>
        <div><b>Volume (CBM):</b> {inputs.volume}</div>
        <div><b>Cargo Type:</b> {inputs.cargoType}</div>
        <div><b>Forwarders:</b> {inputs.selectedForwarders.join(", ") || "None"}</div>
      </div>
    ) : (
      <div className="text-rose-400">No data for selected shipment.</div>
    )}
  </div>
);

export default CanonicalShipmentDetails;
