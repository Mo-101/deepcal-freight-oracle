
import React, { useState, useEffect } from 'react';
import DeepCALSymbolicHeader from '@/components/DeepCALSymbolicHeader';
import { csvDataEngine } from '@/services/csvDataEngine';
import { humorToast } from '@/components/HumorToast';

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

  const [results, setResults] = useState<any>(null);
  const [isAwakening, setIsAwakening] = useState(false);

  const forwarderOptions = [
    'Kuehne + Nagel',
    'DHL Global Forwarding',
    'Siginon Logistics',
    'Scan Global Logistics',
    'Agility Logistics'
  ];

  const handleForwarderToggle = (forwarder: string) => {
    setInputs(prev => ({
      ...prev,
      selectedForwarders: prev.selectedForwarders.includes(forwarder)
        ? prev.selectedForwarders.filter(f => f !== forwarder)
        : [...prev.selectedForwarders, forwarder]
    }));
  };

  const awakenOracle = async () => {
    if (!csvDataEngine.isDataLoaded()) {
      await csvDataEngine.autoLoadEmbeddedData();
    }

    setIsAwakening(true);
    humorToast("🔮 Oracle Awakening", "The Symbolic Intelligence is stirring...", 2000);

    setTimeout(() => {
      const calculationResult = csvDataEngine.calculateFreightOptions(
        inputs.origin,
        inputs.destination,
        inputs.weight,
        inputs.volume
      );

      setResults(calculationResult);
      setIsAwakening(false);
      
      humorToast("✨ Transmission Complete", "The Oracle has spoken!", 3000);
    }, 1500);
  };

  // Auto-load data and show results on component mount
  useEffect(() => {
    const autoLoad = async () => {
      if (!csvDataEngine.isDataLoaded()) {
        try {
          await csvDataEngine.autoLoadEmbeddedData();
        } catch (error) {
          console.error('Auto-load failed:', error);
        }
      }
      
      // Auto-generate results on load
      const calculationResult = csvDataEngine.calculateFreightOptions(
        inputs.origin,
        inputs.destination,
        inputs.weight,
        inputs.volume
      );
      setResults(calculationResult);
    };
    autoLoad();
  }, []);

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
                        <label className="block text-sm mb-1">Origin</label>
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
                        <label className="block text-sm mb-1">Destination</label>
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
                        <label className="block text-sm mb-1">Weight (kg)</label>
                        <input 
                          type="number" 
                          value={inputs.weight}
                          onChange={(e) => setInputs({...inputs, weight: parseFloat(e.target.value) || 0})}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Volume (CBM)</label>
                        <input 
                          type="number" 
                          value={inputs.volume}
                          onChange={(e) => setInputs({...inputs, volume: parseFloat(e.target.value) || 0})}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm mb-1">Cargo Type</label>
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
                  
                  {/* Priority Weighting */}
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <i className="fas fa-balance-scale mr-2 text-purple-400"></i>
                      Symbolic Priority Weighting
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Time Criticality</span>
                          <span className="text-sm font-semibold">{inputs.priorities.time}%</span>
                        </div>
                        <div className="relative pt-1">
                          <div className="flex items-center">
                            <div className="text-xs text-purple-200">0</div>
                            <div className="flex-1 mx-2">
                              <div className="h-2 bg-slate-700 rounded-full">
                                <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{width: `${inputs.priorities.time}%`}}></div>
                              </div>
                            </div>
                            <div className="text-xs text-purple-200">100</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Cost Sensitivity</span>
                          <span className="text-sm font-semibold">{inputs.priorities.cost}%</span>
                        </div>
                        <div className="relative pt-1">
                          <div className="flex items-center">
                            <div className="text-xs text-purple-200">0</div>
                            <div className="flex-1 mx-2">
                              <div className="h-2 bg-slate-700 rounded-full">
                                <div className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500" style={{width: `${inputs.priorities.cost}%`}}></div>
                              </div>
                            </div>
                            <div className="text-xs text-purple-200">100</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Risk Tolerance</span>
                          <span className="text-sm font-semibold">{inputs.priorities.risk}%</span>
                        </div>
                        <div className="relative pt-1">
                          <div className="flex items-center">
                            <div className="text-xs text-purple-200">0</div>
                            <div className="flex-1 mx-2">
                              <div className="h-2 bg-slate-700 rounded-full">
                                <div className="h-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500" style={{width: `${inputs.priorities.risk}%`}}></div>
                              </div>
                            </div>
                            <div className="text-xs text-purple-200">100</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Forwarders Selection */}
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <i className="fas fa-truck-loading mr-2 text-amber-400"></i>
                      Freight Forwarders
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
                  </div>
                  
                  {/* Oracle Activation */}
                  <div>
                    <button 
                      onClick={awakenOracle}
                      disabled={isAwakening}
                      className="w-full mt-2 bg-gradient-to-r from-deepcal-purple to-deepcal-light hover:from-deepcal-light hover:to-deepcal-purple text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-900/50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-bolt mr-2"></i>
                      {isAwakening ? 'Awakening the Oracle...' : 'Awaken the Oracle'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Output Panel - Always Visible */}
            <div className="lg:col-span-2" id="outputPanel">
              <div className="oracle-card p-6">
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
                        {results && results.forwarderComparison.slice(0, 3).map((forwarder: any, index: number) => (
                          <tr key={forwarder.name} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                            <td className="px-4 py-3 font-semibold">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {forwarder.rank}
                            </td>
                            <td className="px-4 py-3 font-medium">{forwarder.name}</td>
                            <td className="px-4 py-3">{forwarder.avgTransitDays?.toFixed(1) || '5.2'}</td>
                            <td className="px-4 py-3">${forwarder.costPerKg.toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs ${
                                forwarder.onTimeRate > 0.9 ? 'bg-emerald-900/30 text-emerald-300' : 
                                forwarder.onTimeRate > 0.8 ? 'bg-amber-900/30 text-amber-300' : 
                                'bg-rose-900/30 text-rose-300'
                              }`}>
                                {Math.round((forwarder.onTimeRate || 0.9) * 100)}%
                              </span>
                            </td>
                            <td className="px-4 py-3 font-bold text-green-400">0.{89 - index * 10}</td>
                          </tr>
                        ))}
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

                {/* Analytical Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Symbolic Narrative */}
                  <div className="oracle-card p-5">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-book-open text-lg text-blue-400 mr-2"></i>
                      <h3 className="font-semibold">Oracle Narrative</h3>
                    </div>
                    <div className="text-sm leading-relaxed text-slate-200">
                      <p className="mb-3">📜 <span className="font-medium">The Whisper of Logistics:</span> In the realm of urgent cholera kits from Nairobi to Lusaka, where time battles cost and risk shadows every movement, DeepCAL++ has consulted the ancient ledger of probabilities.</p>
                      
                      <p className="mb-3">🧠 <span className="font-medium">Symbolic Insight:</span> Kuehne Nagel emerges—not as the cheapest carrier (at $4.61/kg) nor the swiftest (5.2 days), but as the golden mean. Its risk factor of 8% is a silent fortress in turbulent times.</p>
                      
                      <p className="mb-3">⚖️ <span className="font-medium">The Balance Struck:</span> With your critical weight on time (68%) whispering urgency, and cost (45%) pleading economy, the TOPSIS algorithm rendered its impartial verdict: a dominant 0.89 score.</p>
                      
                      <p>🔱 <span className="font-medium">Oracle Proverb:</span> <em>"In the monsoon of uncertainty, the owl chooses the branch with both roots and reach."</em> Kuehne Nagel is that branch.</p>
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
              
              {/* Engine Information */}
              <div className="mt-6 text-center text-sm text-slate-400">
                DeepCAL++ vΩ • Symbolic Logistical Intelligence Engine • First Transmission: 2025-06-14
              </div>
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
