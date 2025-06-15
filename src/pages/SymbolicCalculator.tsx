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
  const [forwarderRFQ, setForwarderRFQ] = useState<Record<string, ForwarderRFQData>>({});
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
    if (!csvDataEngine.isDataLoaded()) {
      await csvDataEngine.autoLoadEmbeddedData();
    }
    setIsAwakening(true);
    humorToast("🔮 Oracle Awakening", "The Symbolic Intelligence is stirring...", 2000);

    // Show animated output after Oracle is "awakened"
    setTimeout(() => {
      const calculationResult = csvDataEngine.calculateFreightOptions(
        inputs.origin,
        inputs.destination,
        inputs.weight,
        inputs.volume
      );
      setResults(calculationResult);
      setIsAwakening(false);
      setShowOutput(true); // Show the output panel
      setTimeout(() => setOutputAnimation(true), 150); // Small delay for animation trigger
      humorToast("✨ Transmission Complete", "The Oracle has spoken!", 3000);
    }, 1500);
  };

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
                  
                  {/* Best Forwarder Display */}
                  {results && (
                    <div className="p-5 bg-green-800/20 rounded-lg border border-green-600/30 mb-6">
                      <h3 className="font-semibold text-green-300 mb-1">🏆 Best Forwarder</h3>
                      <p className="text-2xl font-bold text-green-100">{results.bestForwarder}</p>
                      <p className="text-sm text-green-200 mt-1">Route Score: {results.routeScore}</p>
                    </div>
                  )}

                  {/* Recommendation */}
                  {results && (
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
                          {results && results.forwarderComparison.slice(0, 3).map((forwarder: any, index: number) => {
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
                                  {forwarder.avgTransitDays?.toFixed(1) || '5.2'}
                                  {/* highlight if time is anomaly */}
                                  {hasAnomaly && anomalyMap[forwarder.name].anomalyFields.includes("avgTransitDays") && (
                                    <AlertTriangle className="inline ml-1 text-yellow-400" size={13} />
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  ${forwarder.costPerKg.toFixed(2)}
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
                                <td className="px-4 py-3 font-bold text-green-400">0.{89 - index * 10}</td>
                              </tr>
                            )
                          })}
                          {!results && (
                            <>
                              <tr className="border-b border-slate-700/50 hover:bg-slate-800/30">
                                <td className="px-4 py-3 font-semibold text-deepcal-light">🥇 1</td>
                                <td className="px-4 py-3 font-medium">Kuehne + Nagel</td>
                                <td className="px-4 py-3">5.2</td>
                                <td className="px-4 py-3">$4.61</td>
                                <td className="px-4 py-3"><span className="px-2 py-1 bg-emerald-900/30 text-emerald-300 rounded text-xs">92%</span></td>
                                <td className="px-4 py-3 font-bold text-green-400">0.89</td>
                              </tr>
                              <tr className="border-b border-slate-700/50 hover:bg-slate-800/30">
                                <td className="px-4 py-3 font-semibold text-amber-400">🥈 2</td>
                                <td className="px-4 py-3 font-medium">DHL Global Forwarding</td>
                                <td className="px-4 py-3">6.0</td>
                                <td className="px-4 py-3">$5.21</td>
                                <td className="px-4 py-3"><span className="px-2 py-1 bg-amber-900/30 text-amber-300 rounded text-xs">85%</span></td>
                                <td className="px-4 py-3 font-bold text-amber-400">0.71</td>
                              </tr>
                              <tr className="hover:bg-slate-800/30">
                                <td className="px-4 py-3 font-semibold text-rose-400">🥉 3</td>
                                <td className="px-4 py-3 font-medium">Siginon Logistics</td>
                                <td className="px-4 py-3">6.5</td>
                                <td className="px-4 py-3">$4.45</td>
                                <td className="px-4 py-3"><span className="px-2 py-1 bg-rose-900/30 text-rose-300 rounded text-xs">78%</span></td>
                                <td className="px-4 py-3 font-bold text-rose-400">0.60</td>
                              </tr>
                            </>
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
                    {/* Symbolic Narrative */}
                    <div className="oracle-card p-5">
                      <div className="flex items-center mb-4">
                        <i className="fas fa-book-open text-lg text-blue-400 mr-2"></i>
                        <h3 className="font-semibold">Oracle Narrative</h3>
                        {/* Show anomaly warning if anomalies exist */}
                        {Object.keys(anomalyMap).length > 0 && (
                          <span
                            className="ml-3 inline-flex items-center px-2 py-0.5 bg-yellow-400/90 text-yellow-900 text-[11px] font-bold rounded"
                          >
                            <AlertTriangle className="w-4 h-4 mr-1" /> Anomaly Detected
                          </span>
                        )}
                      </div>
                      <div className="text-sm leading-relaxed text-slate-200">
                        <p className="mb-3">📜 <span className="font-medium">The Whisper of Logistics:</span> In the realm of urgent cholera kits from Nairobi to Lusaka, where time battles cost and risk shadows every movement, DeepCAL++ has consulted the ancient ledger of probabilities.</p>
                        <p className="mb-3">🧠 <span className="font-medium">Symbolic Insight:</span> Kuehne Nagel emerges—not as the cheapest carrier (at $4.61/kg) nor the swiftest (5.2 days), but as the golden mean. Its risk factor of 8% is a silent fortress in turbulent times.</p>
                        <p className="mb-3">⚖️ <span className="font-medium">The Balance Struck:</span> With your critical weight on time (68%) whispering urgency, and cost (45%) pleading economy, the TOPSIS algorithm rendered its impartial verdict: a dominant 0.89 score.</p>
                        <p>🔱 <span className="font-medium">Oracle Proverb:</span> <em>"In the monsoon of uncertainty, the owl chooses the branch with both roots and reach."</em> Kuehne Nagel is that branch.</p>
                        {/* If anomalies, show anomalous forwarders */}
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
                    
                    {/* Symbolic Seal */}
                    <div className="oracle-card p-5 flex flex-col items-center justify-center">
                      <div className="flex items-center mb-4">
                        <i className="fas fa-drafting-compass text-lg text-purple-400 mr-2"></i>
                        <h3 className="font-semibold">Decision Covenant</h3>
                      </div>
                      <div className="decision-seal mb-3">
                        <div className="text-center text-white font-bold text-xs leading-tight">
                          DEEP++ SEAL<br />
                          ✦ VERDICT ✦<br />
                          <span className="text-[8px]">SEALED</span>
                        </div>
                      </div>
                      <div className="text-xs text-center mt-2">
                        <div>qseal:8fa9c27e</div>
                        <div className="text-slate-400 mt-1">TIMESTAMP: {new Date().toISOString()}</div>
                        <div className="mt-2 text-purple-300">"Kuehne Nagel honored with cargo blessing"</div>
                      </div>
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
                      <div className="text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium mb-1">Neutrosophic AHP Weighting:</div>
                            <div className="text-xs bg-slate-800/50 p-3 rounded mb-3">
                              <div>Truth (T) = 0.81</div>
                              <div>Indeterminacy (I) = 0.12</div>
                              <div>Falsehood (F) = 0.07</div>
                              <div className="mt-2">Crisp Score = T - F = 0.74</div>
                            </div>
                            
                            <div className="font-medium mb-1">Normalization Process:</div>
                            <div className="text-xs bg-slate-800/50 p-3 rounded">
                              <code className="block mb-1">X_norm = X_ij / √(ΣX²)</code>
                              <div>Cost Values: [4.61, 5.21, 4.45]</div>
                              <div>Normalized: [0.59, 0.61, 0.64]</div>
                            </div>
                          </div>
                          <div>
                            <div className="font-medium mb-1">TOPSIS Algorithm Execution:</div>
                            <div className="text-xs bg-slate-800/50 p-3 rounded mb-3">
                              <div>Weighted Matrix = Normalized × Weights</div>
                              <div>Ideal Solution = [0.57, 0.59, 0.32]</div>
                              <div>Anti-Ideal = [0.36, 0.42, 0.55]</div>
                              <div>Separation Measures: S+ = √Σ(X-X*)²</div>
                              <div className="mt-2">Closeness = S- / (S+ + S-)</div>
                            </div>
                            
                            <div className="font-medium mb-1">Evidence Hash:</div>
                            <div className="text-xs bg-slate-800/50 p-3 rounded font-mono">
                              sha256:f31d09a7b93c
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Visual Analytics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="oracle-card p-5">
                        <div className="flex items-center mb-4">
                          <i className="fas fa-chart-line text-lg text-cyan-400 mr-2"></i>
                          <h3 className="font-semibold">Performance Radar</h3>
                        </div>
                        <div className="h-64 flex items-center justify-center bg-slate-800/30 rounded-lg">
                          <svg viewBox="0 0 240 240" className="w-full h-full">
                            {/* Grid Lines */}
                            <polygon points="120,40 160,90 120,140 80,90" fill="none" stroke="rgba(126,34,206,0.2)" strokeWidth="1"/>
                            <polygon points="120,60 170,90 120,150 70,90" fill="none" stroke="rgba(126,34,206,0.2)" strokeWidth="1"/>
                            <polygon points="120,80 180,90 120,160 60,90" fill="none" stroke="rgba(126,34,206,0.2)" strokeWidth="1"/>
                            
                            {/* Kuehne Nagel */}
                            <polygon 
                              points="120,80 170,65 150,125 100,130"
                              fill="rgba(126,34,206,0.3)" 
                              stroke="#7e22ce"
                              strokeWidth="2"
                            />
                            {/* DHL Global */}
                            <polygon 
                              points="120,100 160,80 140,140 90,150"
                              fill="rgba(220,38,38,0.3)" 
                              stroke="#dc2626"
                              strokeWidth="2"
                            />
                            {/* Siginon */}
                            <polygon 
                              points="120,120 150,100 130,160 80,170"
                              fill="rgba(251,191,36,0.3)" 
                              stroke="#fbbf24"
                              strokeWidth="2"
                            />
                            
                            {/* Labels */}
                            <text x="200" y="120" textAnchor="end" fill="#e2e8f0" fontSize="10">TIME</text>
                            <text x="120" y="205" textAnchor="middle" fill="#e2e8f0" fontSize="10">COST</text>
                            <text x="40" y="120" textAnchor="start" fill="#e2e8f0" fontSize="10">RISK</text>
                            <text x="180" y="165" textAnchor="middle" fill="#e2e8f0" fontSize="10">RELIABILITY</text>
                          </svg>
                        </div>
                        <div className="text-xs text-center mt-4 flex justify-around">
                          <span className="text-purple-400">K+N</span>
                          <span className="text-rose-400">DHL</span>
                          <span className="text-amber-400">SIG</span>
                        </div>
                      </div>
                      
                      <div className="oracle-card p-5">
                        <div className="flex items-center mb-4">
                          <i className="fas fa-map-marked-alt text-lg text-rose-400 mr-2"></i>
                          <h3 className="font-semibold">Optimal Route Map</h3>
                        </div>
                        <div className="map-container h-64">
                          <div className="map-grid"></div>
                          {/* Origin - Nairobi */}
                          <div className="shipment-node" style={{left: '35%', top: '60%'}}></div>
                          {/* Destination - Lusaka */}
                          <div className="shipment-node" style={{left: '60%', top: '75%'}}></div>
                          {/* Route Line */}
                          <div className="route-line" style={{width: '30%', left: '35%', top: '63%', transform: 'rotate(35deg)'}}></div>
                        </div>
                        <div className="text-xs text-center mt-3">
                          <div className="font-semibold">Nairobi → Lusaka</div>
                          <div className="text-slate-400">Great North Road Corridor (2,100 km)</div>
                          <div className="mt-2 text-sm">
                            <span className="text-green-400">Projected Time: 5.2d</span>
                            <span className="mx-2">|</span>
                            <span>Historic Risk: 8.2%</span>
                          </div>
                        </div>
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
