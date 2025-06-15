
import React from "react";
import type { ForwarderKPI } from '@/services/csvDataEngine';
import type { ForwarderAnomalies } from './anomalyUtils';
import { AlertTriangle } from "lucide-react";

interface Props {
  forwarderKPIs: ForwarderKPI[];
  anomalies: ForwarderAnomalies;
}

export const AnomalyPanel: React.FC<Props> = ({ forwarderKPIs, anomalies }) => {
  const count = Object.keys(anomalies).length;
  if (count === 0) {
    return (
      <div className="oracle-card p-4 border-l-4 border-green-500 bg-green-950 mb-6">
        <div className="flex items-center gap-2 text-green-300 font-semibold">
          <AlertTriangle className="w-5 h-5" />
          No anomalies detected in the current forwarder data.
        </div>
        <div className="text-xs text-slate-400 mt-1">All forwarders within normal performance range.</div>
      </div>
    );
  }
  return (
    <div className="oracle-card p-4 border-l-4 border-yellow-500 bg-yellow-950 mb-6">
      <div className="flex items-center gap-2 text-yellow-300 font-semibold mb-2">
        <AlertTriangle className="w-5 h-5" />
        {count} Anomal{count === 1 ? 'y' : 'ies'} detected in forwarder data!
      </div>
      <ul className="text-xs space-y-1">
        {Object.entries(anomalies).map(([fwd, {reasons, anomalyFields}]) => (
          <li key={fwd} className="pl-1">
            <b className="text-slate-200">{fwd}:</b> {reasons.join("; ")}
          </li>
        ))}
      </ul>
    </div>
  );
};
