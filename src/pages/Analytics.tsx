
import DeepCALHeader from "@/components/DeepCALHeader";
import RealAnalytics from "@/components/RealAnalytics";
import { BarChart } from "lucide-react";

const Analytics = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
    <DeepCALHeader />
    <main className="container max-w-6xl mx-auto pt-5 px-4">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
        <BarChart className="w-7 h-7 text-lime-400" />
        Analytics & KPIs
      </h2>
      <RealAnalytics />
    </main>
  </div>
);

export default Analytics;
