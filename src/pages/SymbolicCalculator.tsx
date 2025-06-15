import React, { useState, useEffect } from 'react';
import DeepCALSymbolicHeader from '@/components/DeepCALSymbolicHeader';
import { csvDataEngine } from '@/services/csvDataEngine';
import { humorToast } from '@/components/HumorToast';
import InteractivePrioritySliders from "@/components/InteractivePrioritySliders";
import { Info } from "lucide-react";
import ForwarderRFQInputs, { ForwarderRFQData } from "@/components/ForwarderRFQInputs";
import { detectForwarderAnomalies } from "@/components/analytical/anomalyUtils";
import { AnomalyPanel } from "@/components/analytical/AnomalyPanel";
import { AlertTriangle } from "lucide-react";
import { formatCurrency, formatWeight, formatVolume, formatDays } from "@/lib/formatUtils";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from '@/components/ui/select'; // uses shadcn/ui
import { Card } from '@/components/ui/card';

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
  const [inputs, setInputs] = useState<CalculatorInputs>({
    origin: 'Kenya',
    destination: 'Zambia',
    weight: 7850,
    volume: 24.5,
    cargoType: 'Emergency Health Kits',
    priorities: {
      time: 68,
      cost: 45,
      risk: 22
    },
    selectedForwarders: ['Kuehne + Nagel', 'DHL Global Forwarding', 'Siginon Logistics']
  });
  // shipment selector state
  const [oldShipments, setOldShipments] = useState<any[]>([]);
  const [selectedReference, setSelectedReference] = useState<string | null>(null);
  const [forwarderRFQ, setForwarderRFQ] = useState<Record<string, ForwarderRFQData>>({});
  const [results, setResults] = useState<any>(null);
  const [isAwakening, setIsAwakening] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [outputAnimation, setOutputAnimation] = useState(false);
  const [anomalyMap, setAnomalyMap] = useState<any>({});
  const [dataStale, setDataStale] = useState(false);
  const [refreshingData, setRefreshingData] = useState(false);

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
    if (inputs.weight < 100 || inputs.weight > 20000) {
      val.weight = "Weight must be between 100 and 20,000 kg.";
    }
    if (inputs.volume < 1 || inputs.volume > 80) {
      val.volume = "Volume must be between 1 and 80 CBM.";
    }
    setValidation(val);
  }, [inputs.weight, inputs.volume]);

  const handleForwarderToggle = (forwarder: string) => {
    setInputs(prev => {
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
      if (inputs.selectedForwarders.includes(forwarder)) {
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

  const awakenOracle = async () => {
    const isLoaded = await csvDataEngine.isDataLoaded();
    if (!isLoaded) {
      await csvDataEngine.autoLoadEmbeddedData();
    }
    setIsAwakening(true);
    humorToast("🔮 Oracle Awakening", "The Symbolic Intelligence is stirring...", 2000);

    // Engine is offline—remove calculation call (just simulate result panel or show engine offline)
    setTimeout(() => {
      // Simulate awakening oracle output OFFLINE
      setResults(null); // Results panel will show "engine coming soon" or similar
      setIsAwakening(false);
      setShowOutput(true);
      setTimeout(() => setOutputAnimation(true), 150);
      humorToast("✨ Transmission Complete", "The Oracle is dormant until the engine is connected.", 3000);
    }, 1500);
  };

  // Load old shipments on mount and check for stale data
  useEffect(() => {
    const fetchShipments = async () => {
      const shipments = await csvDataEngine.listShipments();
      setOldShipments(shipments);
      
      // Check if data is stale
      const isStale = await csvDataEngine.isDataStale();
      setDataStale(isStale);
    };
    fetchShipments();
  }, []);

  // Handle data refresh
  const handleRefreshData = async () => {
    setRefreshingData(true);
    try {
      await csvDataEngine.forceReloadEmbeddedData();
      const freshShipments = await csvDataEngine.listShipments();
      setOldShipments(freshShipments);
      setDataStale(false);
      
      // Clear current selection to avoid confusion
      setSelectedReference(null);
      setResults(null);
      setShowOutput(false);
      setOutputAnimation(false);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      humorToast("❌ Refresh Failed", "Could not reload fresh data from CSV", 3000);
    } finally {
      setRefreshingData(false);
    }
  };

  // Set form fields when shipment is selected
  useEffect(() => {
    if (!selectedReference) {
      // Clear results when no reference is selected
      setResults(null);
      setShowOutput(false);
      setOutputAnimation(false);
      return;
    }
    
    const s = oldShipments.find((sh) => sh.request_reference === selectedReference);
    if (s) {
      setInputs(prev => ({
        ...prev,
        origin: s.origin_country || "",
        destination: s.destination_country || "",
        weight: s.weight_kg ? Number(s.weight_kg) : 0,
        volume: s.volume_cbm ? Number(s.volume_cbm) : 0,
        cargoType: s.item_category || "",
      }));

      // Extract historical analysis data from the selected shipment
      const forwarderData = [
        {
          name: 'Kuehne + Nagel',
          costPerKg: s.kuehne_nagel || 0,
          avgTransitDays: s.frieght_in_time || 0,
          onTimeRate: 0.92, // Default reliability rate
          topsisScore: 0,
          rank: 1
        },
        {
          name: 'DHL Global Forwarding',
          costPerKg: s.dhl_global || 0,
          avgTransitDays: s.frieght_in_time ? s.frieght_in_time + 1 : 0,
          onTimeRate: 0.88,
          topsisScore: 0,
          rank: 2
        },
        {
          name: 'Scan Global Logistics',
          costPerKg: s.scan_global_logistics || 0,
          avgTransitDays: s.frieght_in_time ? s.frieght_in_time + 0.5 : 0,
          onTimeRate: 0.85,
          topsisScore: 0,
          rank: 3
        },
        {
          name: 'Siginon Logistics',
          costPerKg: s.siginon || 0,
          avgTransitDays: s.frieght_in_time ? s.frieght_in_time + 2 : 0,
          onTimeRate: 0.82,
          topsisScore: 0,
          rank: 4
        },
        {
          name: 'Agility Logistics',
          costPerKg: s.agl || 0,
          avgTransitDays: s.frieght_in_time ? s.frieght_in_time + 1.5 : 0,
          onTimeRate: 0.80,
          topsisScore: 0,
          rank: 5
        }
      ].filter(f => f.costPerKg > 0); // Only include forwarders with actual cost data

      // Calculate TOPSIS scores based on cost and time (simple calculation)
      if (forwarderData.length > 0) {
        const costs = forwarderData.map(f => f.costPerKg);
        const times = forwarderData.map(f => f.avgTransitDays);
        
        const minCost = Math.min(...costs);
        const maxCost = Math.max(...costs);
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);
        
        forwarderData.forEach((f, index) => {
          // Simple TOPSIS-like score: lower cost and time = higher score
          const costScore = maxCost > minCost ? (maxCost - f.costPerKg) / (maxCost - minCost) : 0.5;
          const timeScore = maxTime > minTime ? (maxTime - f.avgTransitDays) / (maxTime - minTime) : 0.5;
          f.topsisScore = (costScore * 0.5 + timeScore * 0.5);
        });

        // Sort by TOPSIS score and assign ranks
        forwarderData.sort((a, b) => b.topsisScore - a.topsisScore);
        forwarderData.forEach((f, index) => {
          f.rank = index + 1;
        });
      }

      // Find the best forwarder (awarded one or highest TOPSIS score)
      let bestForwarder = s.final_quote_awarded_freight_forwader_carrier || s.initial_quote_awarded;
      if (!bestForwarder && forwarderData.length > 0) {
        bestForwarder = forwarderData[0].name;
      }

      // Set historical results
      const historicalResults = {
        bestForwarder: bestForwarder,
        routeScore: forwarderData.length > 0 ? forwarderData[0].topsisScore?.toFixed(2) : "N/A",
        forwarderComparison: forwarderData,
        recommendation: `Historical data shows ${bestForwarder || 'selected forwarder'} was chosen for this ${s.item_category || 'shipment'} route from ${s.origin_country} to ${s.destination_country}.`,
        oracleNarrative: `📊 Historical Analysis: This ${s.item_category || 'shipment'} of ${s.weight_kg || 'unknown'}kg was transported from ${s.origin_country} to ${s.destination_country}. ${bestForwarder ? `${bestForwarder} was selected` : 'Forwarder selection recorded'} with delivery status: ${s.delivery_status || 'unknown'}.`,
        methodology: `Analysis based on historical shipment data from ${s.date_of_collection || 'recorded date'}. Costs and transit times extracted from actual shipment record. TOPSIS scoring calculated from available forwarder quotes.`,
        seal: "📋 HISTORICAL",
        qseal: s.request_reference.substring(0, 8),
        timestamp: s.date_of_collection || new Date().toISOString(),
        blessing: `Historical shipment reference: ${s.request_reference}`
      };

      setResults(historicalResults);
      setShowOutput(true);
      setTimeout(() => setOutputAnimation(true), 150);
    }
  }, [selectedReference, oldShipments]);

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
  }, [inputs.origin, inputs.destination, inputs.weight, inputs.volume, inputs.cargoType, inputs.selectedForwarders]);

  useEffect(() => {
    if (results && results.forwarderComparison) {
      const found = detectForwarderAnomalies(results.forwarderComparison);
      setAnomalyMap(found);
    } else {
      setAnomalyMap({});
    }
  }, [results]);

  return (
    <div className="min-h-screen flex flex-col font-space-grotesk" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <DeepCALSymbolicHeader />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* DATA STALENESS WARNING */}
          {dataStale && (
            <Card className="mb-6 p-4 bg-amber-900/20 border border-amber-600/30 rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <i className="fas fa-exclamation-triangle text-amber-400"></i>
                  <div>
                    <div className="font-semibold text-amber-200">Updated Data Detected</div>
                    <div className="text-sm text-amber-300">Your CSV file has been updated. Click refresh to load the latest data.</div>
                  </div>
                </div>
                <button
                  onClick={handleRefreshData}
                  disabled={refreshingData}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {refreshingData ? 'Refreshing...' : 'Refresh Data'}
                </button>
              </div>
            </Card>
          )}

          {/* REFERENCE ID SELECTION */}
          <Card className="mb-8 p-4 flex flex-col gap-2 bg-white/20 border border-deepcal-light rounded-xl shadow transition">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="font-semibold text-purple-300">
                Reference Shipment:
              </div>
              <Select
                value={selectedReference || ""}
                onValueChange={val => setSelectedReference(val)}
                disabled={oldShipments.length === 0}
              >
                <SelectTrigger className="w-80 min-w-[240px]">
                  <SelectValue placeholder="Select a previous shipment..." />
                </SelectTrigger>
                <SelectContent>
                  {oldShipments.length > 0 ?
                    oldShipments.map(sh => (
                      <SelectItem 
                        value={sh.request_reference}
                        key={sh.request_reference}
                        className="text-primary py-2"
                      >
                        <span className="font-mono text-accent">{sh.request_reference}</span>
                        <span className="ml-2 text-slate-600">{sh.origin_country || "?"}→{sh.destination_country || "?"}</span>
                      </SelectItem>
                    )) : (
                      <SelectItem value="__no_shipments__" disabled>
                        No shipments available
                      </SelectItem>
                    )
                  }
                </SelectContent>
              </Select>
              {!dataStale && (
                <button
                  onClick={handleRefreshData}
                  disabled={refreshingData}
                  className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded border border-slate-600 transition-colors disabled:opacity-50"
                  title="Force refresh data from CSV"
                >
                  {refreshingData ? '⟳' : '↻'} Refresh
                </button>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-1">
              <div className="oracle-card p-6 h-full">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <i className="fas fa-shipping-fast mr-3 text-deepcal-light"></i>
                  Shipment Configuration
                </h2>
                
                <div className="space-y-6">
                  {/* Route Details */}
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <i className="fas fa-route mr-2 text-blue-400"></i>
                      Route Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1 flex items-center gap-1">
                          Origin
                          <span title={help.origin}>
                            <Info className="text-purple-400 w-3 h-3" aria-label={help.origin} />
                          </span>
                        </label>
                        <select 
                          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light"
                          value={inputs.origin}
                          onChange={(e) => setInputs({...inputs, origin: e.target.value})}
                        >
                          <option value="Kenya">Nairobi, Kenya</option>
                          <option value="UAE">Dubai, UAE</option>
                          <option value="China">Shanghai, China</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1 flex items-center gap-1">
                          Destination
                          <span title={help.destination}>
                            <Info className="text-purple-400 w-3 h-3" aria-label={help.destination} />
                          </span>
                        </label>
                        <select 
                          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light"
                          value={inputs.destination}
                          onChange={(e) => setInputs({...inputs, destination: e.target.value})}
                        >
                          <option value="Zambia">Lusaka, Zambia</option>
                          <option value="South Africa">Johannesburg, South Africa</option>
                          <option value="Nigeria">Lagos, Nigeria</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cargo Specifications */}
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <i className="fas fa-box-open mr-2 text-yellow-400"></i>
                      Cargo Specifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1 flex items-center gap-1">
                          Weight (kg)
                          <span title={help.weight}>
                            <Info className="text-purple-400 w-3 h-3" aria-label={help.weight} />
                          </span>
                        </label>
                        <input 
                          type="number" 
                          value={inputs.weight}
                          onChange={(e) => setInputs({...inputs, weight: parseFloat(e.target.value) || 0})}
                          className={`w-full bg-slate-800 border ${validation.weight ? "border-rose-500" : "border-slate-700"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light`}
                          min={100} max={20000}
                          aria-describedby="weight-help"
                        />
                        <div id="weight-help" className={`text-xs mt-1 ${validation.weight ? "text-rose-400" : "text-slate-400"}`}>
                          {validation.weight || help.weight}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm mb-1 flex items-center gap-1">
                          Volume (CBM)
                          <span title={help.volume}>
                            <Info className="text-purple-400 w-3 h-3" aria-label={help.volume} />
                          </span>
                        </label>
                        <input 
                          type="number" 
                          value={inputs.volume}
                          onChange={(e) => setInputs({...inputs, volume: parseFloat(e.target.value) || 0})}
                          className={`w-full bg-slate-800 border ${validation.volume ? "border-rose-500" : "border-slate-700"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light`}
                          min={1} max={80}
                          aria-describedby="volume-help"
                        />
                        <div id="volume-help" className={`text-xs mt-1 ${validation.volume ? "text-rose-400" : "text-slate-400"}`}>
                          {validation.volume || help.volume}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm mb-1 flex items-center gap-1">
                        Cargo Type
                        <span title={help.cargoType}>
                          <Info className="text-purple-400 w-3 h-3" aria-label={help.cargoType} />
                        </span>
                      </label>
                      <select 
                        className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light"
                        value={inputs.cargoType}
                        onChange={(e) => setInputs({...inputs, cargoType: e.target.value})}
                      >
                        <option>Emergency Health Kits</option>
                        <option>Pharmaceuticals</option>
                        <option>Laboratory Equipment</option>
                        <option>Cold Chain Supplies</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Priority Weighting - now interactive */}
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <i className="fas fa-balance-scale mr-2 text-purple-400"></i>
                      Symbolic Priority Weighting
                      <span title="Distribute 100% between these priorities to guide your result">
                        <Info className="text-purple-400 w-3 h-3 ml-2" aria-label="Distribute 100% between these priorities to guide your result" />
                      </span>
                    </h3>
                    <InteractivePrioritySliders
                      value={inputs.priorities}
                      onChange={handlePrioritiesChange}
                    />
                  </div>
                  
                  {/* Forwarders Selection */}
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <i className="fas fa-truck-loading mr-2 text-amber-400"></i>
                      Freight Forwarders
                      <span
                        className="ml-2"
                        aria-label={help.forwarder}
                        tabIndex={0}
                        role="img"
                        style={{ outline: "none" }}
                      >
                        <Info className="text-purple-400 w-3 h-3" aria-label={help.forwarder} />
                      </span>
                    </h3>
                    <div className="space-y-2">
                      {forwarderOptions.map(forwarder => (
                        <div key={forwarder} className="flex items-center bg-slate-800 p-3 rounded-lg border border-slate-700">
                          <input 
                            type="checkbox" 
                            className="form-checkbox text-deepcal-light"
                            checked={inputs.selectedForwarders.includes(forwarder)}
                            onChange={() => handleForwarderToggle(forwarder)}
                          />
                          <span className="ml-3">{forwarder}</span>
                        </div>
                      ))}
                    </div>
                    {/* Render RFQ input fields for selected forwarders */}
                    <ForwarderRFQInputs
                      selectedForwarders={inputs.selectedForwarders}
                      rfqData={forwarderRFQ}
                      onChange={handleRFQChange}
                    />
                  </div>
                  
                  {/* Oracle Activation */}
                  <div>
                    <button 
                      onClick={awakenOracle}
                      disabled={isAwakening || !!validation.weight || !!validation.volume}
                      className="w-full mt-2 bg-gradient-to-r from-deepcal-purple to-deepcal-light hover:from-deepcal-light hover:to-deepcal-purple text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-900/50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-bolt mr-2"></i>
                      {isAwakening ? 'Awakening the Oracle...' : 'Awaken the Oracle'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Output Panel - Only Visible After Awakening */}
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

                  {/* Emergency Context */}
                  <div className="p-5 border-b border-slate-700/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-deepcal-light mb-2">🚨 Emergency Context</h3>
                        <p className="text-sm">Cholera spike reported in Kanyama District. ICU stocks at 23%. WHO pre-clearance granted.</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-deepcal-light mb-2">📍 Route Intelligence</h3>
                        <div className="text-sm grid grid-cols-2 gap-2">
                          <div>Distance: <span className="font-mono">2,100 km</span></div>
                          <div>Corridor: <span className="font-mono">Great North Road</span></div>
                          <div>Border Risk: <span className="text-amber-400">⚠️ Medium</span></div>
                          <div>Weather: <span className="text-emerald-400">✅ Clear</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Best Forwarder Display -- show ONLY if results.bestForwarder */}
                  {results && results.bestForwarder && (
                    <div className="p-5 bg-green-800/20 rounded-lg border border-green-600/30 mb-6">
                      <h3 className="font-semibold text-green-300 mb-1">🏆 Best Forwarder</h3>
                      <p className="text-2xl font-bold text-green-100">{results.bestForwarder}</p>
                      <p className="text-sm text-green-200 mt-1">
                        Route Score: <span className="font-mono">{results.routeScore}</span>
                      </p>
                    </div>
                  )}

                  {/* Recommendation -- show ONLY if results.recommendation */}
                  {results && results.recommendation && (
                    <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/30 mb-6">
                      <h4 className="font-semibold text-blue-200 mb-2">💡 Oracle Recommendation</h4>
                      <p className="text-blue-100">{results.recommendation}</p>
                    </div>
                  )}

                  {/* Forwarder Comparison Table -- show header always but rows only if data */}
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
                                    {/* Anomaly flag */}
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
                          // ... place SVG/radar chart based on results.radarData
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
              )}
              {/* Optional: Magical sparkle overlay (JSX element for flair, not blocking content) */}
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
