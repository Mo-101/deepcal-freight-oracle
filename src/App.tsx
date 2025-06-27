
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { loadAllMoScripts } from "@/moscripts/registry";
import LandingPage from "./pages/LandingPage";
import SymbolicCalculator from "./pages/SymbolicCalculator";
import SymbolicDemo from "./pages/SymbolicDemo";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import DeepTalk from "./pages/DeepTalk";
import Training from "./pages/Training";
import MapPage from "./pages/MapPage";
import TrackingPage from "./pages/TrackingPage";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import SymbolicConsciousness from './pages/SymbolicConsciousness';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    loadAllMoScripts();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/app" element={<SymbolicCalculator />} />
              <Route path="/demo" element={<SymbolicDemo />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/deeptalk" element={<DeepTalk />} />
              <Route path="/training" element={<Training />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/tracking" element={<TrackingPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/symbolic-demo" element={<SymbolicDemo />} />
              <Route path="/consciousness" element={<SymbolicConsciousness />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
