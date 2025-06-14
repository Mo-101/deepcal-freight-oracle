
import React, { useState, useEffect } from 'react';
import DeepCALSymbolicHeader from '@/components/DeepCALSymbolicHeader';
import PowerAnalyticalEngine from '@/components/PowerAnalyticalEngine';
import { csvDataEngine } from '@/services/csvDataEngine';

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
    selectedForwarders: ['Kuehne Nagel', 'DHL Global', 'Siginon Logistics']
  });

  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isAwakening, setIsAwakening] = useState(false);

  const forwarderOptions = [
    'Kuehne Nagel',
    'DHL Global',
    'Siginon Logistics', 
    'Scan Global Logistics',
    'AGL'
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

    // Dramatic pause for the awakening
    setTimeout(() => {
      const calculationResult = csvDataEngine.calculateFreightOptions(
        inputs.origin,
        inputs.destination,
        inputs.weight,
        inputs.volume
      );

      setResults(calculationResult);
      setShowResults(true);
      setIsAwakening(false);
      
      setTimeout(() => {
        document.getElementById('outputPanel')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }, 1000);
  };

  useEffect(() => {
    const autoLoad = async () => {
      if (!csvDataEngine.isDataLoaded()) {
        try {
          await csvDataEngine.autoLoadEmbeddedData();
        } catch (error) {
          console.error('Auto-load failed:', error);
        }
      }
    };
    autoLoad();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
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
            
            {/* Output Panel - Power Analytical Engine */}
            {showResults && results && (
              <div className="lg:col-span-2" id="outputPanel">
                <PowerAnalyticalEngine 
                  result={results}
                  inputs={inputs}
                />
              </div>
            )}
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
