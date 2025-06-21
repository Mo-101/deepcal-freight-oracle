import React from 'react';
import UnifiedGlassHeader from '@/components/UnifiedGlassHeader';
import TrainingSection from '@/components/TrainingSection';

export default function Training() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <UnifiedGlassHeader />
      
      <div className="container max-w-5xl mx-auto py-12 px-6">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-yellow-300 mb-6">
            DeepCAL Training Programs
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Welcome to the DeepCAL Training Center. Here, you can enhance your
            skills in logistics, supply chain optimization, and AI-driven
            decision-making. Our programs are designed for both beginners and
            experienced professionals.
          </p>
        </section>

        <TrainingSection
          title="AI in Logistics: Basics"
          description="Learn the fundamentals of AI and its applications in logistics."
          duration="4 weeks"
          level="Beginner"
          topics={[
            "Introduction to AI",
            "Machine Learning for Logistics",
            "AI-driven Route Optimization",
            "Predictive Maintenance",
          ]}
        />

        <TrainingSection
          title="Supply Chain Optimization"
          description="Master advanced techniques for optimizing supply chain efficiency."
          duration="6 weeks"
          level="Intermediate"
          topics={[
            "Demand Forecasting",
            "Inventory Management",
            "Warehouse Automation",
            "Risk Management",
          ]}
        />

        <TrainingSection
          title="Neutrosophic Decision Theory"
          description="Explore decision-making under uncertainty using neutrosophic logic."
          duration="8 weeks"
          level="Advanced"
          topics={[
            "Introduction to Neutrosophy",
            "Neutrosophic Sets and Logic",
            "Decision-Making Models",
            "Case Studies",
          ]}
        />
      </div>
    </div>
  );
}
