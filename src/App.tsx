
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
        {/* Uncomment these lines if those files exist: */}
        {/*
        <Route path="/" element={<DeepCAL />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/map" element={<Map />} />
        */}
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
