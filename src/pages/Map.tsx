
import DeepCALHeader from "@/components/DeepCALHeader";

const Map = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
    <DeepCALHeader />
    <main className="container max-w-4xl mx-auto pt-12 px-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <span role="img" aria-label="map">🗺️</span>
        DeepCAL Map (Coming Soon)
      </h2>
      <div className="p-6 bg-white rounded-xl shadow-md text-center text-slate-600">
        Our global freight optimization map visualization is assembling.<br />
        Stay tuned for interactive features!
      </div>
    </main>
  </div>
);

export default Map;
