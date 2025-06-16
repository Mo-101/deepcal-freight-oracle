
import DeepCALHeader from "@/components/DeepCALHeader";
import { BarChart2, BadgeCheck } from "lucide-react";

const demo = [
  { forwarder: "Alpha Carrier", closeness: 0.82 },
  { forwarder: "Bravo Freight", closeness: 0.76 },
  { forwarder: "GammaRunner", closeness: 0.63 },
];

const Ranking = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
    <DeepCALHeader />
    <main className="container max-w-3xl mx-auto pt-5">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-white">
        <BarChart2 className="w-7 h-7 text-lime-400" />
        Route/Forwarder Rankings (TOPSIS)
      </h2>
      <table className="w-full border-collapse rounded-xl overflow-hidden bg-white/10 backdrop-blur-lg shadow mb-6">
        <thead>
          <tr className="bg-indigo-900/50">
            <th className="py-2 px-3 text-left font-normal text-white">Forwarder</th>
            <th className="py-2 px-3 text-left font-normal text-white">Closeness (Ci)</th>
            <th className="py-2 px-3 text-left font-normal text-white">Best?</th>
          </tr>
        </thead>
        <tbody>
          {demo.map((row, i) => (
            <tr key={row.forwarder} className={i === 0 ? "bg-green-900/30 text-white" : "text-white"}>
              <td className="py-3 px-3 font-medium">{row.forwarder}</td>
              <td className="py-3 px-3">{row.closeness}</td>
              <td className="py-3 px-3">{i === 0 ? <BadgeCheck className="inline-block w-5 h-5 text-lime-400" /> : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-sm text-indigo-200 px-2">
        <span>
          Rankings computed via <b>Grey/Neutrosophic AHP-TOPSIS</b>.
          <br />
          <span className="italic">"It's not magic—it's math, but with room for uncertainty and sarcasm."</span>
        </span>
      </div>
    </main>
  </div>
);

export default Ranking;
