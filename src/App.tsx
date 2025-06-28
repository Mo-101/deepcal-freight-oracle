
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import LandingPage from '@/pages/LandingPage';
import About from '@/pages/About';
import FreightCalculator from '@/pages/FreightCalculator';
import SymbolicCalculator from '@/pages/SymbolicCalculator';
import SymbolicDemo from '@/pages/SymbolicDemo';
import Analytics from '@/pages/Analytics';
import DeepTalk from '@/pages/DeepTalk';
import MapPage from '@/pages/MapPage';
import RFQPage from '@/pages/RFQPage';
import NewShipments from '@/pages/NewShipments';
import SymbolicConsciousness from '@/pages/SymbolicConsciousness';
import SymbolicTrainingPage from '@/pages/SymbolicTrainingPage';
import NotFound from '@/pages/NotFound';

// DeepCAL Engine Pages
import DeepCALCore from '@/pages/deepcal/index';
import DeepCALRanking from '@/pages/deepcal/ranking';
import ConsciousnessInterface from '@/pages/deepcal/consciousness';
import TrainingLaboratory from '@/pages/deepcal/training';
import EngineSettings from '@/pages/deepcal/settings';

// Removed imports that do not exist in ./pages

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/freight-calculator" element={<FreightCalculator />} />
            <Route path="/symbolic-calculator" element={<SymbolicCalculator />} />
            <Route path="/symbolic-demo" element={<SymbolicDemo />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/deep-talk" element={<DeepTalk />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/rfq" element={<RFQPage />} />
            <Route path="/new-shipments" element={<NewShipments />} />
            <Route path="/symbolic-consciousness" element={<SymbolicConsciousness />} />
            <Route path="/symbolic-training" element={<SymbolicTrainingPage />} />
            
            {/* DeepCAL Engine Routes */}
            <Route path="/deepcal" element={<DeepCALCore />} />
            <Route path="/deepcal/ranking" element={<DeepCALRanking />} />
            <Route path="/deepcal/consciousness" element={<ConsciousnessInterface />} />
            <Route path="/deepcal/training" element={<TrainingLaboratory />} />
            <Route path="/deepcal/settings" element={<EngineSettings />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
