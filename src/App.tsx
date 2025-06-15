
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Analytics from "./pages/Analytics";

// If you have DeepCAL, Settings, Map page components, import them like below:
// import DeepCAL from "./pages/DeepCAL";
// import Settings from "./pages/Settings";
// import Map from "./pages/Map";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        {/* Set Analytics page as the default root route */}
        <Route path="/" element={<Analytics />} />
        <Route path="/analytics" element={<Analytics />} />
        {/* Uncomment these lines if those pages exist: */}
        {/*
        <Route path="/deepcal" element={<DeepCAL />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/map" element={<Map />} />
        */}
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
