
import React from "react";
import DeepCALHeader from "@/components/DeepCALHeader";
import { BrainCog, Target, Zap, Shield, Globe, TrendingUp } from "lucide-react";

const Dashboard: React.FC = () => {
  const features = [
    {
      icon: <BrainCog className="w-8 h-8 text-lime-400" />,
      title: "Neutrosophic Engine",
      description: "Advanced multi-criteria decision making using Neutrosophic + AHP + TOPSIS + Grey System framework for optimal freight routing."
    },
    {
      icon: <Target className="w-8 h-8 text-blue-400" />,
      title: "Precision Optimization",
      description: "Real-time analysis of cost, time, and risk factors to deliver scientifically validated shipping recommendations."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Offline-First Architecture",
      description: "IndexedDB-powered local storage ensures continuous operation even without network connectivity."
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-400" />,
      title: "Data Integrity",
      description: "Immutable base data (deeptrack_2.csv) with append-only live updates and strict schema validation using Zod."
    },
    {
      icon: <Globe className="w-8 h-8 text-green-400" />,
      title: "Cloud Sync",
      description: "Seamless synchronization between IndexedDB cache and Firestore when network connectivity returns."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-400" />,
      title: "Continuous Learning",
      description: "Firebase Functions handle nightly retraining with synthetic data generation and weight matrix optimization."
    }
  ];

  return (
    <div className="bg-gradient-to-br min-h-screen from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALHeader />
      <main className="container max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-2xl">
              <BrainCog className="w-20 h-20 text-lime-400" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            About DeepCAL
          </h1>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto leading-relaxed">
            "Nothing Moves Without the Core." – DeepCAL is an advanced multi-criteria freight optimization engine 
            that combines cutting-edge mathematical frameworks with practical logistics intelligence.
          </p>
        </div>

        {/* Core Philosophy */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-12 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Core Philosophy</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-lime-400 mb-3">Scientific Foundation</h3>
              <p className="text-indigo-200">
                DeepCAL operates on rigorous mathematical principles, ensuring every decision is grounded 
                in data science rather than guesswork. Our Neutrosophic logic handles uncertainty while 
                AHP and TOPSIS provide structured multi-criteria analysis.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-lime-400 mb-3">Zero Placeholders</h3>
              <p className="text-indigo-200">
                We maintain strict data integrity with no hard-coded outputs or demo values. 
                If real data isn't available, the system shows nothing rather than misleading placeholders.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="text-lg font-semibold text-white ml-3">{feature.title}</h3>
              </div>
              <p className="text-indigo-200 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Technical Architecture */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Technical Architecture</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-lime-400 font-mono text-lg mb-2">Data Layer</div>
              <p className="text-indigo-200 text-sm">
                deeptrack_2.csv → IndexedDB → Firestore sync with strict Zod validation
              </p>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-mono text-lg mb-2">Engine Core</div>
              <p className="text-indigo-200 text-sm">
                Neutrosophic + AHP + TOPSIS + Grey System mathematical framework
              </p>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-mono text-lg mb-2">Learning Loop</div>
              <p className="text-indigo-200 text-sm">
                Firebase Functions with MostlyAI synthetic data generation and weight optimization
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-indigo-200 mb-6">Ready to experience scientifically-grounded freight optimization?</p>
          <div className="flex justify-center gap-4">
            <a 
              href="/calculator" 
              className="bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Try Calculator
            </a>
            <a 
              href="/training" 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              View Training
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
