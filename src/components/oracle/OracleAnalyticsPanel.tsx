
import React from "react";

interface OracleAnalyticsPanelProps {
  results: any;
  selectedReference: string;
  showOutput: boolean;
  outputAnimation: boolean;
}

const OracleAnalyticsPanel: React.FC<OracleAnalyticsPanelProps> = ({
  results,
  selectedReference,
  showOutput,
  outputAnimation,
}) =>
  showOutput ? (
    <div
      className={`oracle-card p-6 w-full transition-all duration-1000
        ${outputAnimation ? "animate-magical-appear opacity-100 scale-100 blur-0" : "opacity-0 scale-90 blur-md"}
      `}
      style={{
        boxShadow:
          "0 0 60px 10px rgba(168, 85, 247, 0.24), 0 0 0 2px #a855f7 inset",
        borderColor: "rgba(168, 85, 247, 0.8)",
      }}
    >
      {/* Oracle Transmission Header */}
      <div className="bg-gradient-to-r from-deepcal-dark to-deepcal-purple p-5 rounded-t-xl symbolic-border">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <i className="fas fa-scroll text-2xl text-white mr-3"></i>
            <div>
              <h2 className="text-xl font-semibold text-white">🕊️ DEEPCAL FULL ANALYTICS PANEL</h2>
              <p className="text-sm text-purple-100">
                Canonical Shipment: <span className="font-mono">{selectedReference}</span>
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-black/20 rounded-full text-sm flex items-center border border-purple-400/30">
            <i className="fas fa-bolt text-yellow-400 mr-2"></i>
            <span>ARCHIVAL SHIPMENT EVIDENCE</span>
          </div>
        </div>
      </div>

      {/* Oracle Narrative */}
      <div className="oracle-card p-5 my-6">
        <div className="flex items-center mb-4">
          <i className="fas fa-book-open text-lg text-blue-400 mr-2"></i>
          <h3 className="font-semibold">Oracle Narrative</h3>
        </div>
        <div className="text-sm leading-relaxed text-slate-200">
          {results && results.narrative ? (
            <p>{results.narrative}</p>
          ) : (
            <p className="italic text-slate-400">No Oracle analysis yet for this shipment.</p>
          )}
        </div>
      </div>

      {/* Methodology Analysis */}
      <div className="oracle-card p-5 my-6">
        <div className="flex items-center mb-4">
          <i className="fas fa-calculator text-lg text-emerald-400 mr-2"></i>
          <h3 className="font-semibold">Symbolic Methodology Analysis</h3>
        </div>
        <div className="text-sm">
          {!!results && !!results.methodology ? (
            <div>{results.methodology}</div>
          ) : (
            <div className="italic text-slate-400">No methodology data for this shipment.</div>
          )}
        </div>
      </div>

      {/* Performance Radar */}
      <div className="oracle-card p-5 my-6">
        <div className="flex items-center mb-4">
          <i className="fas fa-chart-line text-lg text-cyan-400 mr-2"></i>
          <h3 className="font-semibold">Performance Radar</h3>
        </div>
        <div>
          {!!results && !!results.radarSvg ? (
            <div dangerouslySetInnerHTML={{ __html: results.radarSvg }} />
          ) : (
            <div className="italic text-slate-400">Radar data not available.</div>
          )}
        </div>
      </div>

      {/* Optimal Route Map */}
      <div className="oracle-card p-5 my-6">
        <div className="flex items-center mb-4">
          <i className="fas fa-map-marked-alt text-lg text-rose-400 mr-2"></i>
          <h3 className="font-semibold">Optimal Route Map</h3>
        </div>
        <div>
          {!!results && !!results.routeMapSvg ? (
            <div dangerouslySetInnerHTML={{ __html: results.routeMapSvg }} />
          ) : (
            <div className="italic text-slate-400">Route map not available.</div>
          )}
        </div>
      </div>
    </div>
  ) : null;

export default OracleAnalyticsPanel;
