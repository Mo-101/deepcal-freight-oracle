
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BrainCog, 
  ArrowRight, 
  Zap, 
  BarChart, 
  MessageSquare, 
  Dumbbell,
  Globe,
  Shield,
  TrendingUp,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const LandingPage = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Symbolic Logistics Intelligence Engine';
  
  useEffect(() => {
    let i = 0;
    const typeWriter = () => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
        setTimeout(typeWriter, 100);
      }
    };
    setTimeout(typeWriter, 1000);
  }, []);

  const features = [
    {
      icon: <BarChart className="w-8 h-8 text-lime-400" />,
      title: 'Deep Analytics',
      description: 'Real-time freight optimization with AI-powered insights',
      path: '/analytics'
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-blue-400" />,
      title: 'DeepTalk',
      description: 'Voice-enabled intelligent assistant for logistics queries',
      path: '/deeptalk'
    },
    {
      icon: <Dumbbell className="w-8 h-8 text-purple-400" />,
      title: 'Neural Training',
      description: 'Continuous learning and model optimization',
      path: '/training'
    },
    {
      icon: <BrainCog className="w-8 h-8 text-orange-400" />,
      title: 'Symbolic Calculator',
      description: 'Advanced multi-criteria decision optimization',
      path: '/calculator'
    }
  ];

  const stats = [
    { label: 'Routes Optimized', value: '50,847', icon: <Globe className="w-6 h-6" /> },
    { label: 'Cost Savings', value: '$2.4M', icon: <TrendingUp className="w-6 h-6" /> },
    { label: 'Active Users', value: '1,247', icon: <Users className="w-6 h-6" /> },
    { label: 'Reliability', value: '99.7%', icon: <Shield className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-lime-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-lime-400 rounded-full opacity-60"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-12 h-12 rounded-lg overflow-hidden"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <img 
                src="/lovable-uploads/de1f267d-5603-44ce-979f-b745009bd7b1.png" 
                alt="DeepCAL Logo" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-white">DeepCAL++ vΩ</h1>
              <p className="text-sm text-indigo-300">Mission Control</p>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-6xl mx-auto"
          >
            {/* Main Title with Logo */}
            <motion.div className="flex items-center justify-center mb-6">
              <img 
                src="/lovable-uploads/de1f267d-5603-44ce-979f-b745009bd7b1.png" 
                alt="DeepCAL Logo" 
                className="w-20 h-20 mr-4"
              />
              <motion.h1 
                className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-lime-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                DeepCAL++
                <motion.span 
                  className="text-gold-400 ml-4"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  vΩ
                </motion.span>
              </motion.h1>
            </motion.div>

            {/* Animated Tagline */}
            <div className="h-16 mb-8">
              <motion.p 
                className="text-2xl md:text-3xl text-indigo-200 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {typedText}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-lime-400"
                >
                  |
                </motion.span>
              </motion.p>
            </div>

            {/* Hero Headlines */}
            <motion.div 
              className="space-y-4 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <p className="text-xl text-slate-300">The Future of Logistics Intelligence</p>
              <p className="text-lg text-slate-400">Where Algorithms Meet Intuition</p>
              <p className="text-md text-slate-500">Powered by Symbolic AI & Neutrosophic Logic</p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/calculator">
                <Button 
                  size="lg" 
                  className="px-12 py-6 text-xl bg-gradient-to-r from-lime-500 to-blue-500 hover:from-lime-400 hover:to-blue-400 text-white font-bold rounded-full shadow-2xl hover:shadow-lime-500/25 transition-all duration-300 group"
                >
                  <Zap className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                  Enter Mission Control
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4 }}
          >
            {stats.map((stat, index) => (
              <Card key={stat.label} className="glass-card border-slate-700 bg-slate-800/30">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3 text-lime-400">
                    {stat.icon}
                  </div>
                  <motion.div 
                    className="text-2xl font-bold text-white mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4.5 + index * 0.2 }}
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Feature Cards */}
          <motion.div 
            className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 5.5 + index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Link to={feature.path}>
                  <Card className="glass-card border-slate-700 bg-slate-800/30 hover:bg-slate-700/40 transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-lime-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                        {feature.description}
                      </p>
                      <div className="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-lime-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-sm text-slate-500">
            © 2025 DeepCAL++ Technologies • The First Symbolic Logistical Intelligence Engine • 🔱
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
