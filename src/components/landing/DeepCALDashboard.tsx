import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Cpu, Shield, Brain, Settings, Bell, Search, Network, Layers, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { postgresTrainingService } from '@/services/postgresTrainingService';

// Sample data for DeepCAL metrics
const symbolicProcessingData = [
  { name: '00:00', value: 40 },
  { name: '04:00', value: 30 },
  { name: '08:00', value: 60 },
  { name: '12:00', value: 50 },
  { name: '16:00', value: 70 },
  { name: '20:00', value: 90 },
  { name: '24:00', value: 60 },
];

const neutrosophicData = [
  { name: 'Truth', value: 85 },
  { name: 'Indeterminacy', value: 10 },
  { name: 'Falsity', value: 5 },
];

const topsisOptimizationData = [
  { name: 'Week 1', value: 20 },
  { name: 'Week 2', value: 35 },
  { name: 'Week 3', value: 45 },
  { name: 'Week 4', value: 60 },
  { name: 'Week 5', value: 75 },
  { name: 'Week 6', value: 85 },
];

const DEEPCAL_COLORS = ['#FFB43A', '#C1FF57', '#00E0C6', '#6254F3'];

const healthData = [
  { name: 'Health', value: 80 },
];

const COLORS = ['#FFB43A', '#C1FF57', '#00E0C6', '#6254F3'];

export default function DeepCALDashboard() {
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [trainingStats, setTrainingStats] = useState({
    samplesProcessed: 0,
    accuracy: 0,
    lastTraining: 'Never',
    modelVersion: 'v1.0'
  });

  useEffect(() => {
    const loadTrainingStats = async () => {
      try {
        const stats = await postgresTrainingService.getTrainingStats();
        setTrainingStats({
          samplesProcessed: stats.totalSyntheticRecords + stats.totalRealRecords,
          accuracy: Math.round(stats.avgAccuracy * 100),
          lastTraining: new Date(stats.lastTraining).toLocaleDateString(),
          modelVersion: 'v2.1'
        });
      } catch (error) {
        console.error('Failed to load training stats:', error);
      }
    };

    loadTrainingStats();
    const interval = setInterval(loadTrainingStats, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-deepcal-solar-gold via-deepcal-neon-lime to-deepcal-deep-aqua">
            DeepCAL++ Intelligence Core
          </h1>

          <div className="flex items-center space-x-4">
            <div className="relative w-64 hidden md:block">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-deepcal-text-muted" />
              <Input 
                placeholder="Search intelligence patterns..." 
                className="pl-8 bg-deepcal-surface border-deepcal-deep-purple text-white" 
              />
            </div>

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Symbolic Rule Processing */}
        <Card
          className={cn(
            'bg-deepcal-surface border-deepcal-deep-purple hover:border-deepcal-solar-gold transition-all cursor-pointer',
            activeWidget === 'processing' && 'border-deepcal-solar-gold',
          )}
          onClick={() => setActiveWidget(activeWidget === 'processing' ? null : 'processing')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-deepcal-text-primary">Symbolic Rule Engine</CardTitle>
            <Cpu className="h-4 w-4 text-deepcal-solar-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">76%</div>
            <p className="text-xs text-deepcal-text-secondary">+12% processing efficiency</p>
            <div className="h-[80px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={symbolicProcessingData}>
                  <defs>
                    <linearGradient id="colorProcessing" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFB43A" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FFB43A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#FFB43A"
                    fillOpacity={1}
                    fill="url(#colorProcessing)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Neutrosophic Logic Matrix */}
        <Card
          className={cn(
            'bg-deepcal-surface border-deepcal-deep-purple hover:border-deepcal-neon-lime transition-all cursor-pointer',
            activeWidget === 'neutrosophic' && 'border-deepcal-neon-lime',
          )}
          onClick={() => setActiveWidget(activeWidget === 'neutrosophic' ? null : 'neutrosophic')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-deepcal-text-primary">Neutrosophic Logic</CardTitle>
            <Shield className="h-4 w-4 text-deepcal-neon-lime" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">89%</div>
            <p className="text-xs text-deepcal-text-secondary">Truth confidence level</p>
            <div className="h-[80px] mt-4 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={neutrosophicData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={35}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {neutrosophicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DEEPCAL_COLORS[index % DEEPCAL_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* TOPSIS Optimization */}
        <Card
          className={cn(
            'bg-deepcal-surface border-deepcal-deep-purple hover:border-deepcal-deep-aqua transition-all cursor-pointer',
            activeWidget === 'topsis' && 'border-deepcal-deep-aqua',
          )}
          onClick={() => setActiveWidget(activeWidget === 'topsis' ? null : 'topsis')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-deepcal-text-primary">TOPSIS Optimization</CardTitle>
            <Brain className="h-4 w-4 text-deepcal-deep-aqua" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{trainingStats.accuracy}%</div>
            <p className="text-xs text-deepcal-text-secondary">Model accuracy achieved</p>
            <div className="h-[80px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topsisOptimizationData}>
                  <Bar dataKey="value" fill="#00E0C6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Freight Intelligence Network */}
        <Card
          className={cn(
            'bg-deepcal-surface border-deepcal-deep-purple hover:border-deepcal-ember-orange transition-all cursor-pointer',
            activeWidget === 'network' && 'border-deepcal-ember-orange',
          )}
          onClick={() => setActiveWidget(activeWidget === 'network' ? null : 'network')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-deepcal-text-primary">Freight Intelligence</CardTitle>
            <Network className="h-4 w-4 text-deepcal-ember-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">98%</div>
            <p className="text-xs text-deepcal-text-secondary">Network optimization</p>
            <div className="w-full h-2 bg-deepcal-deep-purple rounded-full mt-4">
              <div
                className="h-full bg-gradient-to-r from-deepcal-ember-orange to-deepcal-solar-gold rounded-full"
                style={{ width: '98%' }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-deepcal-text-muted">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expanded Widget View */}
      {activeWidget && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <Card className="bg-deepcal-surface border-deepcal-deep-purple">
            <CardHeader>
              <CardTitle className="text-deepcal-text-primary">
                {activeWidget === 'processing' && 'Symbolic Rule Engine Analysis'}
                {activeWidget === 'neutrosophic' && 'Neutrosophic Logic Deep Dive'}
                {activeWidget === 'topsis' && 'TOPSIS Optimization Insights'}
                {activeWidget === 'network' && 'Freight Intelligence Network'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  {activeWidget === 'processing' && (
                    <AreaChart data={symbolicProcessingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                        itemStyle={{ color: '#f3f4f6' }}
                      />
                      <defs>
                        <linearGradient id="colorProcessingExpanded" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFB43A" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#FFB43A" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#FFB43A"
                        fillOpacity={1}
                        fill="url(#colorProcessingExpanded)"
                      />
                    </AreaChart>
                  )}

                  {activeWidget === 'neutrosophic' && (
                    <BarChart data={neutrosophicData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                        itemStyle={{ color: '#f3f4f6' }}
                      />
                      <Bar dataKey="value" fill="#C1FF57" />
                    </BarChart>
                  )}

                  {activeWidget === 'topsis' && (
                    <AreaChart data={topsisOptimizationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                        itemStyle={{ color: '#f3f4f6' }}
                      />
                      <defs>
                        <linearGradient id="colorTopsisExpanded" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00E0C6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#00E0C6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#00E0C6"
                        fillOpacity={1}
                        fill="url(#colorTopsisExpanded)"
                      />
                    </AreaChart>
                  )}

                  {activeWidget === 'network' && (
                    <BarChart
                      data={[
                        { name: 'Routes', value: 98 },
                        { name: 'Carriers', value: 95 },
                        { name: 'Ports', value: 92 },
                        { name: 'Hubs', value: 99 },
                        { name: 'Intelligence', value: 97 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                        itemStyle={{ color: '#f3f4f6' }}
                      />
                      <Bar dataKey="value" fill="#FF7849" />
                    </BarChart>
                  )}

                  {activeWidget === 'health' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={healthData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {healthData.map((entry, index) => (
                            <Cell key={`health-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Training Statistics Summary */}
      <Card className="mt-6 bg-deepcal-surface border-deepcal-deep-purple">
        <CardHeader>
          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-deepcal-solar-gold via-deepcal-neon-lime to-deepcal-deep-aqua">
            PostgreSQL Training Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-deepcal-background/50 rounded-lg">
              <div className="text-deepcal-solar-gold text-2xl font-bold">
                {trainingStats.samplesProcessed.toLocaleString()}
              </div>
              <div className="text-deepcal-text-secondary text-sm">Samples Processed</div>
            </div>
            <div className="text-center p-4 bg-deepcal-background/50 rounded-lg">
              <div className="text-deepcal-neon-lime text-2xl font-bold">
                {trainingStats.accuracy}%
              </div>
              <div className="text-deepcal-text-secondary text-sm">Model Accuracy</div>
            </div>
            <div className="text-center p-4 bg-deepcal-background/50 rounded-lg">
              <div className="text-deepcal-deep-aqua text-2xl font-bold">
                {trainingStats.lastTraining}
              </div>
              <div className="text-deepcal-text-secondary text-sm">Last Training</div>
            </div>
            <div className="text-center p-4 bg-deepcal-background/50 rounded-lg">
              <div className="text-deepcal-ember-orange text-2xl font-bold">
                {trainingStats.modelVersion}
              </div>
              <div className="text-deepcal-text-secondary text-sm">Model Version</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
