import React from 'react';
import EmergencyContextCard from './EmergencyContextCard';
import RouteIntelligenceCard from './RouteIntelligenceCard';
import { detectForwarderAnomalies } from "@/components/analytical/anomalyUtils";
import { AnomalyPanel } from "@/components/analytical/AnomalyPanel";
import { AlertTriangle } from "lucide-react";
import { formatCurrency, formatDays } from "@/lib/formatUtils";

interface OracleResultsPanelProps {
  showOutput: boolean;
  outputAnimation: boolean;
  results: any;
  selectedShipment: any;
  anomalyMap: any;
}

const OracleResultsPanel: React.FC<OracleResultsPanelProps> = ({
  showOutput,
  outputAnimation,
  results,
  selectedShipment,
  anomalyMap
}) => {
  // Generate dynamic context based on selected shipment
  const generateEmergencyContext = (shipment: any) => {
    if (!shipment) {
      return {
        isEmergency: false,
        context: "No shipment data available",
        grade: "Ungraded"
      };
    }

    const emergencyGrade = shipment['emergency grade'] || shipment.emergency_grade || 'Ungraded';
    const isEmergency = emergencyGrade.toLowerCase().includes('grade');
    const cargoType = shipment.item_category || shipment.cargo_description || 'Unknown cargo';
    const destination = shipment.destination_country || 'Unknown destination';

    if (isEmergency) {
      let emergencyDetails = "";
      if (cargoType.toLowerCase().includes('cholera')) {
        emergencyDetails = `Cholera outbreak response in ${destination}. Critical medical supplies required urgently.`;
      } else if (cargoType.toLowerCase().includes('health') || cargoType.toLowerCase().includes('medical')) {
        emergencyDetails = `Health emergency in ${destination}. Medical intervention supplies needed.`;
      } else if (cargoType.toLowerCase().includes('trauma')) {
        emergencyDetails = `Trauma response deployment to ${destination}. Emergency medical kits required.`;
      } else {
        emergencyDetails = `Emergency humanitarian response to ${destination}. Critical supplies deployment.`;
      }

      return {
        isEmergency: true,
        context: emergencyDetails,
        grade: emergencyGrade,
        priority: "HIGH PRIORITY"
      };
    } else {
      return {
        isEmergency: false,
        context: `Standard logistics operation: ${cargoType} delivery to ${destination}.`,
        grade: emergencyGrade || "Standard",
        priority: "STANDARD"
      };
    }
  };

  const generateRouteIntelligence = (shipment: any) => {
    if (!shipment) {
      return {
        distance: "Unknown",
        corridor: "Unknown route",
        borderRisk: "Unknown",
        weather: "Unknown"
      };
    }

    const origin = shipment.origin_country || 'Unknown';
    const destination = shipment.destination_country || 'Unknown';
    const mode = shipment.mode_of_shipment || 'Unknown';
    
    let distance = "Unknown";
    if (shipment.origin_latitude && shipment.origin_longitude && 
        shipment.destination_latitude && shipment.destination_longitude) {
      const lat1 = parseFloat(shipment.origin_latitude);
      const lon1 = parseFloat(shipment.origin_longitude);
      const lat2 = parseFloat(shipment.destination_latitude);
      const lon2 = parseFloat(shipment.destination_longitude);
      
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const calculatedDistance = R * c;
      distance = `${Math.round(calculatedDistance)} km`;
    }

    let corridor = "Unknown route";
    if (origin.toLowerCase().includes('kenya') && destination.toLowerCase().includes('zambia')) {
      corridor = "Great North Road (A104)";
    } else if (origin.toLowerCase().includes('kenya') && destination.toLowerCase().includes('zimbabwe')) {
      corridor = "North-South Corridor";
    } else if (origin.toLowerCase().includes('kenya')) {
      corridor = `${origin} → ${destination} Corridor`;
    } else {
      corridor = `${origin} → ${destination}`;
    }

    let borderRisk = "⚠️ Medium";
    const deliveryStatus = shipment.delivery_status || '';
    if (deliveryStatus.toLowerCase() === 'delivered') {
      borderRisk = "✅ Low";
    } else if (deliveryStatus.toLowerCase().includes('delayed')) {
      borderRisk = "🔴 High";
    }

    const weather = mode.toLowerCase() === 'air' ? "✅ Clear for aviation" : "🌤️ Ground conditions normal";

    return {
      distance,
      corridor,
      borderRisk,
      weather,
      mode: mode.toUpperCase()
    };
  };

  const emergencyContext = generateEmergencyContext(selectedShipment);
  const routeIntelligence = generateRouteIntelligence(selectedShipment);

  if (!showOutput) return null;

  return (
    <div
      className={`oracle-card p-6 w-full transition-all duration-1000
        ${outputAnimation ? 'animate-magical-appear opacity-100 scale-100 blur-0' : 'opacity-0 scale-90 blur-md'}
      `}
      style={{
        boxShadow:
          '0 0 60px 10px rgba(168, 85, 247, 0.24), 0 0 0 2px #a855f7 inset',
        borderColor: 'rgba(168, 85, 247, 0.8)',
      }}
    >
      {/* Oracle Transmission Header */}
      <div className="bg-gradient-to-r from-deepcal-dark to-deepcal-purple p-5 rounded-t-xl symbolic-border">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <i className="fas fa-scroll text-2xl text-white mr-3"></i>
            <div>
              <h2 className="text-xl font-semibold text-white">🕊️ SYMBOLIC LOGISTICS TRANSMISSION</h2>
              <p className="text-sm text-purple-100">DeepCAL++ vΩ LIVING ORACLE REPORT</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-black/20 rounded-full text-sm flex items-center border border-purple-400/30">
            <i className="fas fa-bolt text-yellow-400 mr-2"></i>
            <span>ACTIVE TRANSMISSION • VERDICT PENDING</span>
          </div>
        </div>
      </div>

      {/* Dynamic Emergency & Route Context */}
      <div className="p-5 border-b border-slate-700/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EmergencyContextCard emergencyContext={emergencyContext} />
          <RouteIntelligenceCard routeIntelligence={routeIntelligence} />
        </div>
      </div>
      
      {/* Best Forwarder Display */}
      {results && results.bestForwarder && (
        <div className="p-5 bg-green-800/20 rounded-lg border border-green-600/30 mb-6">
          <h3 className="font-semibold text-green-300 mb-1">🏆 Best Forwarder</h3>
          <p className="text-2xl font-bold text-green-100">{results.bestForwarder}</p>
          <p className="text-sm text-green-200 mt-1">
            Route Score: <span className="font-mono">{results.routeScore}</span>
          </p>
        </div>
      )}

      {/* Recommendation */}
      {results && results.recommendation && (
        <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/30 mb-6">
          <h4 className="font-semibold text-blue-200 mb-2">💡 Oracle Recommendation</h4>
          <p className="text-blue-100">{results.recommendation}</p>
        </div>
      )}

      {/* Forwarder Comparison Table */}
      <div className="bg-slate-900/50 rounded-xl overflow-hidden symbolic-border mb-6">
        <div className="px-5 py-3 bg-gradient-to-r from-deepcal-dark to-deepcal-purple flex justify-between items-center">
          <h3 className="font-semibold flex items-center">
            <i className="fas fa-trophy mr-2"></i>
            TOPSIS Ranking Matrix
          </h3>
          <span className="text-xs bg-black/20 px-2 py-1 rounded">Closeness Coefficient Algorithm</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-deepcal-purple/30">
              <tr>
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-left">Forwarder</th>
                <th className="px-4 py-3 text-left">Time (days)</th>
                <th className="px-4 py-3 text-left">Cost (USD/kg)</th>
                <th className="px-4 py-3 text-left">Risk</th>
                <th className="px-4 py-3 text-left">TOPSIS Score</th>
              </tr>
            </thead>
            <tbody>
              {results && results.forwarderComparison && results.forwarderComparison.length > 0 ? (
                results.forwarderComparison.map((forwarder: any, index: number) => {
                  const hasAnomaly = !!anomalyMap[forwarder.name];
                  return (
                    <tr
                      key={forwarder.name}
                      className={`border-b border-slate-700/50 hover:bg-slate-800/30 ${hasAnomaly ? "bg-yellow-900/40" : ""}`}
                    >
                      <td className="px-4 py-3 font-semibold flex items-center gap-1">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {forwarder.rank}
                        {hasAnomaly && (
                          <AlertTriangle className="ml-1 text-yellow-400" size={15} />
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium">{forwarder.name}</td>
                      <td className="px-4 py-3">
                        {formatDays(forwarder.avgTransitDays)}
                        {hasAnomaly && anomalyMap[forwarder.name].anomalyFields.includes("avgTransitDays") && (
                          <AlertTriangle className="inline ml-1 text-yellow-400" size={13} />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {formatCurrency(forwarder.costPerKg)}
                        {hasAnomaly && anomalyMap[forwarder.name].anomalyFields.includes("costPerKg") && (
                          <AlertTriangle className="inline ml-1 text-yellow-400" size={13} />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          forwarder.onTimeRate > 0.9 ? 'bg-emerald-900/30 text-emerald-300' : 
                          forwarder.onTimeRate > 0.8 ? 'bg-amber-900/30 text-amber-300' : 
                          'bg-rose-900/30 text-rose-300'
                        }`}>
                          {Math.round((forwarder.onTimeRate || 0.9) * 100)}%
                          {hasAnomaly && anomalyMap[forwarder.name].anomalyFields.includes("onTimeRate") && (
                            <AlertTriangle className="inline ml-1 text-yellow-400" size={11} />
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-green-400">
                        {forwarder.topsisScore ? forwarder.topsisScore.toFixed(2) : ""}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground italic">
                    No results to display. Please run calculation with shipment details.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Anomaly Detection Panel */}
      <AnomalyPanel
        forwarderKPIs={results?.forwarderComparison || []}
        anomalies={anomalyMap}
      />

      {/* Analytical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Symbolic Narrative -- show nothing if no results */}
        <div className="oracle-card p-5">
          <div className="flex items-center mb-4">
            <i className="fas fa-book-open text-lg text-blue-400 mr-2"></i>
            <h3 className="font-semibold">Oracle Narrative</h3>
            {Object.keys(anomalyMap).length > 0 && (
              <span
                className="ml-3 inline-flex items-center px-2 py-0.5 bg-yellow-400/90 text-yellow-900 text-[11px] font-bold rounded"
              >
                <AlertTriangle className="w-4 h-4 mr-1" /> Anomaly Detected
              </span>
            )}
          </div>
          <div className="text-sm leading-relaxed text-slate-200">
            {results && results.oracleNarrative ? (
              <>{results.oracleNarrative}</>
            ) : (
              <div className="text-slate-500 italic">No data yet.</div>
            )}
            {Object.keys(anomalyMap).length > 0 && (
              <div className="mt-4 text-yellow-300 text-xs">
                <b>Anomaly Report:</b>
                <ul className="mt-1 space-y-1">
                  {Object.entries(anomalyMap).map(([fwd, val]:any) =>
                    <li key={fwd}>
                      <span className="font-semibold">{fwd}</span>: {val.reasons.join("; ")}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Symbolic Seal, data hidden unless avail */}
        <div className="oracle-card p-5 flex flex-col items-center justify-center">
          <div className="flex items-center mb-4">
            <i className="fas fa-drafting-compass text-lg text-purple-400 mr-2"></i>
            <h3 className="font-semibold">Decision Covenant</h3>
          </div>
          {results && results.seal ? (
            <div className="decision-seal mb-3">{results.seal}</div>
          ) : (
            <div className="text-xs text-center text-slate-500">No data yet.</div>
          )}
          {results && results.qseal && (
            <div className="text-xs text-center mt-2">
              <div>qseal:{results.qseal}</div>
              <div className="text-slate-400 mt-1">Timestamp: {results.timestamp}</div>
              <div className="mt-2 text-purple-300">{results.blessing}</div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 gap-6">
        {/* Methodology Explanation */}
        <div className="oracle-card p-5">
          <div className="flex items-center mb-4">
            <i className="fas fa-calculator text-lg text-emerald-400 mr-2"></i>
            <h3 className="font-semibold">Symbolic Methodology Analysis</h3>
          </div>
          {results && results.methodology ? (
            <div className="text-sm">{results.methodology}</div>
          ) : (
            <div className="text-xs text-slate-500">No data yet.</div>
          )}
        </div>
        
        {/* Visual Analytics (Performance Radar) -- show empty unless results.radarData */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="oracle-card p-5">
            <div className="flex items-center mb-4">
              <i className="fas fa-chart-line text-lg text-cyan-400 mr-2"></i>
              <h3 className="font-semibold">Performance Radar</h3>
            </div>
            {results && results.radarData ? (
              <div className="h-64 flex items-center justify-center bg-slate-800/30 rounded-lg">
                {/* Radar chart from results.radarData */}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <span className="text-xs text-slate-400">No data yet.</span>
              </div>
            )}
            <div className="text-xs text-center mt-4 flex justify-around">
              {results && results.radarData ? (
                <span className="text-purple-400">K+N</span>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="oracle-card p-5">
            <div className="flex items-center mb-4">
              <i className="fas fa-map-marked-alt text-lg text-rose-400 mr-2"></i>
              <h3 className="font-semibold">Optimal Route Map</h3>
            </div>
            {results && results.routeMap ? (
              <div className="map-container h-64">
                {/* Render map from results.routeMap */}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <span className="text-xs text-slate-400">No data yet.</span>
              </div>
            )}
            {results && results.routeMapDesc && (
              <div className="text-xs text-center mt-3 text-slate-400">{results.routeMapDesc}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OracleResultsPanel;
