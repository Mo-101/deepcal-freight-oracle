
import React from "react";
import DeepCALHeader from "@/components/DeepCALHeader";
import { BrainCog, Target, Zap, Shield, Globe, TrendingUp } from "lucide-react";

const Dashboard: React.FC = () => {
  const features = [
    {
      icon: <BrainCog className="w-6 h-6 sm:w-8 sm:h-8 text-lime-400" />,
      title: "Neutrosophic Engine",
      description: "Advanced multi-criteria decision making using Neutrosophic + AHP + TOPSIS + Grey System framework for optimal freight routing."
    },
    {
      icon: <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />,
      title: "Precision Optimization",
      description: "Real-time analysis of cost, time, and risk factors to deliver scientifically validated shipping recommendations."
    },
    {
      icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />,
      title: "Offline-First Architecture",
      description: "IndexedDB-powered local storage ensures continuous operation even without network connectivity."
    },
    {
      icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />,
      title: "Data Integrity",
      description: "Immutable base data (deeptrack_2.csv) with append-only live updates and strict schema validation using Zod."
    },
    {
      icon: <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />,
      title: "Cloud Sync",
      description: "Seamless synchronization between IndexedDB cache and Firestore when network connectivity returns."
    },
    {
      icon: <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />,
      title: "Continuous Learning",
      description: "Firebase Functions handle nightly retraining with synthetic data generation and weight matrix optimization."
    }
  ];

  return (
    <div className="bg-gradient-to-br min-h-screen from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALHeader />
      <main className="container max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-white/10 rounded-2xl">
              <BrainCog className="w-12 h-12 sm:w-20 sm:h-20 text-lime-400" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3 sm:mb-4">
            About DeepCAL
          </h1>
          <p className="text-lg sm:text-xl text-indigo-200 max-w-3xl mx-auto leading-relaxed px-4">
            "Nothing Moves Without the Core." – DeepCAL is an advanced multi-criteria freight optimization engine 
            that combines cutting-edge mathematical frameworks with practical logistics intelligence.
          </p>
        </div>

        {/* Core Philosophy */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-8 mb-8 sm:mb-12 border border-white/20">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">Core Philosophy</h2>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-lime-400 mb-2 sm:mb-3">Scientific Foundation</h3>
              <p className="text-sm sm:text-base text-indigo-200 leading-relaxed">
                DeepCAL operates on rigorous mathematical principles, ensuring every decision is grounded 
                in data science rather than guesswork. Our Neutrosophic logic handles uncertainty while 
                AHP and TOPSIS provide structured multi-criteria analysis.
              </p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-lime-400 mb-2 sm:mb-3">Zero Placeholders</h3>
              <p className="text-sm sm:text-base text-indigo-200 leading-relaxed">
                We maintain strict data integrity with no hard-coded outputs or demo values. 
                If real data isn't available, the system shows nothing rather than misleading placeholders.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="flex items-center mb-3 sm:mb-4">
                {feature.icon}
                <h3 className="text-base sm:text-lg font-semibold text-white ml-2 sm:ml-3">{feature.title}</h3>
              </div>
              <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Technical Architecture */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-8 border border-white/20 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">Technical Architecture</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-lime-400 font-mono text-sm sm:text-lg mb-2">Data Layer</div>
              <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed">
                deeptrack_2.csv → IndexedDB → Firestore sync with strict Zod validation
              </p>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-mono text-sm sm:text-lg mb-2">Engine Core</div>
              <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed">
                Neutrosophic + AHP + TOPSIS + Grey System mathematical framework
              </p>
            </div>
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="text-purple-400 font-mono text-sm sm:text-lg mb-2">Learning Loop</div>
              <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed">
                Firebase Functions with MostlyAI synthetic data generation and weight optimization
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-indigo-200 mb-4 sm:mb-6 text-sm sm:text-base">Ready to experience scientifically-grounded freight optimization?</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <a 
              href="/calculator" 
              className="bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all text-sm sm:text-base"
            >
              Try Calculator
            </a>
            <a 
              href="/training" 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all text-sm sm:text-base"
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
