
import { BarChart } from "lucide-react";

const Analytics = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
    {/* Header removed because DeepCALHeader was deleted */}
    <main className="container max-w-6xl mx-auto pt-5 px-4">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <BarChart className="w-7 h-7 text-pink-600" />
        Analytics & KPIs
      </h2>
      {/* RealAnalytics component likely also deleted, so omit it */}
      {/* You can add any analytics content here */}
      <div className="bg-white shadow rounded-lg p-8 text-center text-gray-500">
        No analytics data available.
      </div>
    </main>
  </div>
);

export default Analytics;

