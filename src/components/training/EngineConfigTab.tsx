
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cpu, Zap, Key } from 'lucide-react';
import { unifiedAIService } from '@/services/unifiedAIService';
import { useToast } from '@/hooks/use-toast';

interface ModelConfig {
  provider: 'openai' | 'groq' | 'claude' | 'mixtral';
  model: string;
  creativity: number;
  responseLength: number;
  contextWindow: number;
  realTimeProcessing: boolean;
}

interface TrainingMetrics {
  samplesProcessed: number;
  accuracy: number;
  lastTraining: string;
  modelVersion: string;
}

interface TrainingActivity {
  id: string;
  stage: string;
  progress: number;
  timestamp: string;
  status: 'active' | 'completed' | 'pending';
  metrics: {
    loss: number;
    accuracy: number;
    learningRate: number;
  };
}

interface EngineConfigTabProps {
  modelConfig: ModelConfig;
  setModelConfig: React.Dispatch<React.SetStateAction<ModelConfig>>;
  trainingMetrics: TrainingMetrics;
  isTraining: boolean;
  trainingActivities: TrainingActivity[];
}

export function EngineConfigTab({ 
  modelConfig, 
  setModelConfig, 
  trainingMetrics, 
  isTraining, 
  trainingActivities 
}: EngineConfigTabProps) {
  const { toast } = useToast();
  const [openaiKey, setOpenaiKey] = useState('');
  const [groqKey, setGroqKey] = useState('');

  useEffect(() => {
    // Load current AI configuration
    const aiConfig = unifiedAIService.getConfig();
    setModelConfig(prev => ({
      ...prev,
      provider: aiConfig.provider,
      model: aiConfig.model,
      creativity: Math.round(aiConfig.temperature * 100),
      responseLength: Math.round((aiConfig.maxTokens / 2000) * 100),
      contextWindow: Math.round(aiConfig.contextWindow / 1000)
    }));

    // Load API keys
    setOpenaiKey(localStorage.getItem('openai-api-key') || '');
    setGroqKey(localStorage.getItem('groq-api-key') || '');
  }, [setModelConfig]);

  const handleProviderChange = (provider: string) => {
    const newConfig = { ...modelConfig, provider: provider as any };
    setModelConfig(newConfig);
    
    // Update unified AI service
    unifiedAIService.updateConfig({
      provider: provider as any,
      model: provider === 'openai' ? 'gpt-4o' : 'llama3-70b-8192'
    });

    toast({
      title: '🤖 AI Provider Updated',
      description: `Switched to ${provider.toUpperCase()}`,
    });
  };

  const handleConfigChange = (key: string, value: number) => {
    const newConfig = { ...modelConfig, [key]: value };
    setModelConfig(newConfig);

    // Map UI values to AI service parameters
    const aiConfig: any = {};
    if (key === 'creativity') {
      aiConfig.temperature = value / 100; // Convert 0-100 to 0-1
    }
    if (key === 'responseLength') {
      aiConfig.maxTokens = Math.round((value / 100) * 2000); // Convert to token count
    }
    if (key === 'contextWindow') {
      aiConfig.contextWindow = value * 1000; // Convert to actual tokens
    }

    unifiedAIService.updateConfig(aiConfig);
  };

  const handleSaveApiKey = (provider: 'openai' | 'groq') => {
    const key = provider === 'openai' ? openaiKey : groqKey;
    if (key.trim()) {
      localStorage.setItem(`${provider}-api-key`, key.trim());
      unifiedAIService.loadConfig(); // Reload to pick up new key
      
      toast({
        title: '🔑 API Key Saved',
        description: `${provider.toUpperCase()} API key configured successfully`,
      });

      // Force a re-render by updating the key display
      if (provider === 'openai') {
        setOpenaiKey(key.trim());
      } else {
        setGroqKey(key.trim());
      }
    }
  };

  const testConnection = async () => {
    try {
      const response = await unifiedAIService.generateResponse([
        { role: 'user', content: 'Test connection - respond with "Connected!"' }
      ]);
      
      toast({
        title: '✅ Connection Successful',
        description: `${unifiedAIService.getProvider().name} is working correctly`,
      });
    } catch (error) {
      toast({
        title: '❌ Connection Failed',
        description: 'Please check your API key and try again',
        variant: 'destructive'
      });
      console.error('Connection test failed:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Real AI Model Configuration */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-lime-400 flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            AI Provider & Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-indigo-300 mb-2 block">AI Provider</Label>
            <select 
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-lime-400"
              value={modelConfig.provider}
              onChange={(e) => handleProviderChange(e.target.value)}
            >
              <option value="openai">OpenAI GPT-4 (Recommended + Voice)</option>
              <option value="groq">Groq Llama (Fast)</option>
            </select>
          </div>

          {/* API Key Configuration */}
          <div className="space-y-3 bg-slate-800/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-yellow-400" />
              <span className="text-indigo-300 text-sm font-medium">API Configuration</span>
            </div>
            
            {modelConfig.provider === 'openai' && (
              <div className="space-y-2">
                <Label className="text-indigo-300 text-xs">OpenAI API Key</Label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder="sk-proj-..."
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />
                  <Button size="sm" onClick={() => handleSaveApiKey('openai')}>
                    Save
                  </Button>
                </div>
                {openaiKey && (
                  <p className="text-xs text-green-400">✓ API key configured</p>
                )}
              </div>
            )}

            {modelConfig.provider === 'groq' && (
              <div className="space-y-2">
                <Label className="text-indigo-300 text-xs">Groq API Key</Label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value={groqKey}
                    onChange={(e) => setGroqKey(e.target.value)}
                    placeholder="gsk_..."
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />
                  <Button size="sm" onClick={() => handleSaveApiKey('groq')}>
                    Save
                  </Button>
                </div>
                {groqKey && (
                  <p className="text-xs text-green-400">✓ API key configured</p>
                )}
              </div>
            )}

            <Button size="sm" onClick={testConnection} className="w-full">
              Test Connection
            </Button>
          </div>

          {/* Functional Configuration Sliders */}
          <div>
            <Label className="text-indigo-300 mb-2 block">Creativity (Temperature)</Label>
            <input
              type="range"
              min={0}
              max={100}
              value={modelConfig.creativity}
              onChange={(e) => handleConfigChange('creativity', Number(e.target.value))}
              className="w-full accent-lime-400"
            />
            <div className="flex justify-between text-xs text-indigo-300 mt-1">
              <span>Precise</span>
              <span>Balanced</span>
              <span>Creative</span>
            </div>
            <span className="text-lime-400 text-sm">{modelConfig.creativity}% (temp: {(modelConfig.creativity / 100).toFixed(2)})</span>
          </div>

          <div>
            <Label className="text-indigo-300 mb-2 block">Response Length (Max Tokens)</Label>
            <input
              type="range"
              min={0}
              max={100}
              value={modelConfig.responseLength}
              onChange={(e) => handleConfigChange('responseLength', Number(e.target.value))}
              className="w-full accent-lime-400"
            />
            <div className="flex justify-between text-xs text-indigo-300 mt-1">
              <span>Brief</span>
              <span>Moderate</span>
              <span>Detailed</span>
            </div>
            <span className="text-lime-400 text-sm">{Math.round((modelConfig.responseLength / 100) * 2000)} tokens</span>
          </div>
        </CardContent>
      </Card>

      {/* Real Performance Metrics */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-lime-400 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Live Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-indigo-300">AI Status</span>
              <Badge className={unifiedAIService.isConfigured() ? "bg-green-600" : "bg-red-600"}>
                {unifiedAIService.getStatus()}
              </Badge>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-indigo-300">Voice Support</span>
              <Badge className={unifiedAIService.supportsVoice() ? "bg-green-600" : "bg-yellow-600"}>
                {unifiedAIService.supportsVoice() ? 'OpenAI TTS' : 'Browser Only'}
              </Badge>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-indigo-300">Model Accuracy</span>
              <span className="text-lime-400 font-mono">{trainingMetrics.accuracy}%</span>
            </div>
            <Progress value={trainingMetrics.accuracy} className="h-2" />
          </div>

          <div className="pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-indigo-300">Provider:</span>
              <span className="text-white">{unifiedAIService.getProvider().name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-indigo-300">Model:</span>
              <span className="text-white">{unifiedAIService.getConfig().model}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-indigo-300">Context:</span>
              <span className="text-white">{unifiedAIService.getConfig().contextWindow / 1000}K tokens</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
