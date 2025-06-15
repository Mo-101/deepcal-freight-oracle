import React, { useState, useEffect } from 'react';
import DeepCALSymbolicHeader from '@/components/DeepCALSymbolicHeader';
import { csvDataEngine, ShipmentRecord } from '@/services/csvDataEngine';
import { humorToast } from '@/components/HumorToast';
import InteractivePrioritySliders from "@/components/InteractivePrioritySliders";
import { Info } from "lucide-react";
import ForwarderRFQInputs, { ForwarderRFQData } from "@/components/ForwarderRFQInputs";
import { detectForwarderAnomalies } from "@/components/analytical/anomalyUtils";
import { AnomalyPanel } from "@/components/analytical/AnomalyPanel";
import { AlertTriangle } from "lucide-react";
import { formatCurrency, formatWeight, formatVolume, formatDays } from "@/lib/formatUtils";

interface CalculatorInputs {
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
}

const SymbolicCalculator = () => {
  // --- NEW: Canonical shipment selection state ---
  const [allShipments, setAllShipments] = useState<ShipmentRecord[]>([]);
  const [selectedReference, setSelectedReference] = useState<string>('');
  // canonical default: all calculators are based on base data, not user entry
  const [canonicalInputs, setCanonicalInputs] = useState<CalculatorInputs | null>(null);

  const [results, setResults] = useState<any>(null);
  const [isAwakening, setIsAwakening] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [outputAnimation, setOutputAnimation] = useState(false);
  const [anomalyMap, setAnomalyMap] = useState<any>({});

  const forwarderOptions = [
    'Kuehne + Nagel',
    'DHL Global Forwarding',
    'Siginon Logistics',
    'Scan Global Logistics',
    'Agility Logistics'
  ];

  const [validation, setValidation] = useState<{weight?: string; volume?: string}>({});
  // Handle priorities change from slider
  const handlePrioritiesChange = (priorities: CalculatorInputs["priorities"]) => {
    setInputs((prev) => ({
      ...prev,
      priorities,
    }));
  };

  // For field tooltips
  const help = {
    weight: "Total shipment weight in kilograms (range: 100 - 20,000kg).",
    volume: "Total shipment volume in cubic meters (CBM) (range: 1 - 80).",
    cargoType: "What type of cargo is being shipped?",
    origin: "Select the shipment starting country.",
    destination: "Select the shipment destination.",
    forwarder: "Select one or more companies to compare."
  };

  // Validation for form inputs
  useEffect(() => {
    let val: typeof validation = {};
    if (inputs && (inputs.weight < 100 || inputs.weight > 20000)) {
      val.weight = "Weight must be between 100 and 20,000 kg.";
    }
    if (inputs && (inputs.volume < 1 || inputs.volume > 80)) {
      val.volume = "Volume must be between 1 and 80 CBM.";
    }
    setValidation(val);
  }, [inputs?.weight, inputs?.volume]);

  const [forwarderRFQ, setForwarderRFQ] = useState<Record<string, ForwarderRFQData>>({});

  const handleForwarderToggle = (forwarder: string) => {
    setInputs(prev => {
      if (!prev) return prev;
      const selected = prev.selectedForwarders.includes(forwarder)
        ? prev.selectedForwarders.filter(f => f !== forwarder)
        : [...prev.selectedForwarders, forwarder];
      return {
        ...prev,
        selectedForwarders: selected
      };
    });
    setForwarderRFQ(prev => {
      // When adding, initialize if missing. When removing, prune.
      if (inputs && inputs.selectedForwarders.includes(forwarder)) {
        // Removing
        const newRFQ = { ...prev };
        delete newRFQ[forwarder];
        return newRFQ;
      } else {
        // Adding
        return {
          ...prev,
          [forwarder]: prev[forwarder] || { rate: "", days: "", comments: "" }
        };
      }
    });
  };

  const handleRFQChange = (forwarder: string, data: ForwarderRFQData) => {
    setForwarderRFQ(prev => ({
      ...prev,
      [forwarder]: data
    }));
  };

  // NEW: Load base shipments at mount, default first one
  useEffect(() => {
    async function loadBaseShipments() {
      const shipments = await csvDataEngine.listShipments();
      setAllShipments(shipments);
      if (shipments.length > 0) {
        setSelectedReference(shipments[0].request_reference);
      }
    }
    loadBaseShipments();
  }, []);

  // When the selectedReference changes, update canonicalInputs
  useEffect(() => {
    if (!selectedReference || allShipments.length === 0) return;
    const record = allShipments.find(s => s.request_reference === selectedReference);
    if (record) {
      setCanonicalInputs({
        origin: record.origin_country,
        destination: record.destination_country,
        weight: record.weight_kg,
        volume: record.volume_cbm,
        cargoType: record.item_category,
        priorities: {
          time: 50,
          cost: 30,
          risk: 20
        },
        selectedForwarders: [
          ...(record.kuehne_nagel ? ['Kuehne + Nagel'] : []),
          ...(record.dhl_global ? ['DHL Global Forwarding'] : []),
          ...(record.siginon ? ['Siginon Logistics'] : []),
          ...(record.scan_global_logistics ? ['Scan Global Logistics'] : []),
          ...(record.agl ? ['Agility Logistics'] : [])
        ]
      });
    }
  }, [selectedReference, allShipments]);

  // OVERRIDE: Ignore user entry -- always use canonicalInputs
  const [inputs, setInputs] = useState<CalculatorInputs | null>(null);

  useEffect(() => {
    if (canonicalInputs) {
      setInputs(canonicalInputs);
    }
  }, [canonicalInputs]);

  // Hide output panel on initial mount and on input changes
  useEffect(() => {
    setShowOutput(false);
    setOutputAnimation(false);
    if (!csvDataEngine.isDataLoaded()) {
      const loadData = async () => {
        try {
          await csvDataEngine.autoLoadEmbeddedData();
        } catch (error) {
          console.error('Auto-load failed:', error);
        }
      };
      loadData();
    }
  }, [canonicalInputs]);

  useEffect(() => {
    if (results && results.forwarderComparison) {
      const found = detectForwarderAnomalies(results.forwarderComparison);
      setAnomalyMap(found);
    } else {
      setAnomalyMap({});
    }
  }, [results]);

  // Fake awakening function—only runs analytics on canonical shipment
  const awakenOracle = async () => {
    if (!inputs) return;
    // Simulate analytics for base shipment
    setIsAwakening(true);
    humorToast("🔮 Oracle Awakening", `Analyzing canonical shipment: ${selectedReference}`, 1200);

    setTimeout(() => {
      // Populate results with "no data" if no engine exists
      setResults({
        bestForwarder: "",
        routeScore: null,
        recommendation: "Full analytics engine integration required.",
        forwarderComparison: [],
        narrative: null,
        methodology: null,
        radarSvg: null,
        routeMapSvg: null
      });
      setIsAwakening(false);
      setShowOutput(true);
      setTimeout(() => setOutputAnimation(true), 150);
      humorToast("✨ Transmission Complete", "Static panel until engine integrated.", 2000);
    }, 1100);
  };

  // --- UI ---
  return (
    <div className="min-h-screen flex flex-col font-space-grotesk" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <DeepCALSymbolicHeader />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">

          {/* Select requested canonical shipment */}
          <div className="mb-5">
            <label className="block font-medium mb-1 text-white">
              Select Canonical Shipment (Request Reference)
            </label>
            <select
              className="w-full max-w-md bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white"
              value={selectedReference}
              onChange={e => setSelectedReference(e.target.value)}
            >
              {allShipments.map(s => (
                <option key={s.request_reference} value={s.request_reference}>
                  {s.request_reference} ({s.origin_country} → {s.destination_country})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input panel, now disabled - only shows canonical shipment info */}
            <div className="lg:col-span-1">
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
                    <div><b>Forwarders:</b> {inputs.selectedForwarders.join(', ') || "None"}</div>
                  </div>
                ) : (
                  <div className="text-rose-400">No data for selected shipment.</div>
                )}

                {/* Oracle Activation */}
                <div className="mt-8">
                  <button
                    onClick={awakenOracle}
                    disabled={isAwakening || !inputs}
                    className="w-full bg-gradient-to-r from-deepcal-purple to-deepcal-light hover:from-deepcal-light hover:to-deepcal-purple text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-900/50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-bolt mr-2"></i>
                    {isAwakening ? 'Analyzing...' : 'Show Full Analytics'}
                  </button>
                </div>
              </div>
            </div>

            {/* Output Panel - Only for canonical shipment */}
            <div className={`lg:col-span-2 relative min-h-[300px] flex items-center justify-center`}>
              {showOutput && (
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
                          <h2 className="text-xl font-semibold text-white">🕊️ DEEPCAL FULL ANALYTICS PANEL</h2>
                          <p className="text-sm text-purple-100">Canonical Shipment: <span className="font-mono">{selectedReference}</span></p>
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
                      {/* FUTURE: Display real narrative from analytics */}
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
              )}
              {/* Optional: Magical sparkle overlay */}
              {showOutput && outputAnimation && (
                <div className="pointer-events-none absolute inset-0 z-20">
                  <div className="magical-sparkle-overlay" />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-slate-700 mt-8">
        <div className="container mx-auto text-center">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-8">
            <div>
              <i className="fas fa-brain text-deepcal-light mr-2"></i>
              PHASE I – Power Analytical Engine (ACTIVE)
            </div>
            <div>
              <i className="fas fa-chart-network text-deepcal-light mr-2"></i>
              PHASE II – Neural Visualization (Q2 2025)
            </div>
            <div>
              <i className="fas fa-wave-square text-deepcal-light mr-2"></i>
              PHASE III – DeepTalk Voice (Q3 2025)
            </div>
            <div>
              <i className="fas fa-bolt text-deepcal-light mr-2"></i>
              PHASE IV – Live Integration (Q4 2025)
            </div>
          </div>
          <div className="mt-6 text-xs text-slate-500">
            © 2025 DeepCAL++ Technologies • The First Symbolic Logistical Intelligence Engine • 🔱
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SymbolicCalculator;
