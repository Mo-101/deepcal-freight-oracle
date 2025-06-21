
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { loadAllMoScripts } from "@/moscripts/registry";
import GlobalChatbot from "@/components/GlobalChatbot";
import LandingPage from "./pages/LandingPage";
import SymbolicCalculator from "./pages/SymbolicCalculator";
import About from "./pages/About";
import Analytics from "./pages/Analytics";
import DeepTalk from "./pages/DeepTalk";
import MapPage from "./pages/MapPage";
import Training from "./pages/Training";
import RFQPage from "./pages/RFQPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    loadAllMoScripts();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/calculator" element={<SymbolicCalculator />} />
            <Route path="/about" element={<About />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/deeptalk" element={<DeepTalk />} />
            <Route path="/training" element={<Training />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/rfq" element={<RFQPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <GlobalChatbot />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
