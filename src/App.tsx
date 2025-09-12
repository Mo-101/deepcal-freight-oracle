import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { loadAllMoScripts } from "@/moscripts/registry";
import SymbolicCalculator from "./pages/SymbolicCalculator";
import Analytics from "./pages/Analytics";
import DeepTalk from "./pages/DeepTalk";
import RankingPage from "./pages/RankingPage";
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
            <Route path="/" element={<SymbolicCalculator />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/deeptalk" element={<DeepTalk />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;