import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Loading from './loading';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const DeepTalk = lazy(() => import('./pages/DeepTalk'));
const FreightCalculator = lazy(() => import('./pages/FreightCalculator'));
const SymbolicCalculator = lazy(() => import('./pages/SymbolicCalculator'));
const Analytics = lazy(() => import('./pages/Analytics'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));
const NewShipments = lazy(() => import('./pages/NewShipments'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

console.log('App component initializing...');

function App() {
  console.log('App component rendering...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="deepcal-ui-theme">
        <Router>
          <div className="min-h-screen bg-background">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/app" element={<DeepTalk />} />
                <Route path="/demo" element={<DeepTalk />} />
                <Route path="/calculator" element={<FreightCalculator />} />
                <Route path="/symbolic" element={<SymbolicCalculator />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/about" element={<About />} />
                <Route path="/new-shipment" element={<NewShipments />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Toaster />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
