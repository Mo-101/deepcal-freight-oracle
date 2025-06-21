
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { configService } from '@/services/configService';
import { syntheticDataService } from '@/services/syntheticDataService';
import { useToast } from '@/hooks/use-toast';

export const ApiKeysPanel: React.FC = () => {
  const { toast } = useToast();
  const [showKeys, setShowKeys] = useState(false);
  const [config, setConfig] = useState(configService.getConfig());

  const refreshConfig = () => {
    setConfig(configService.getConfig());
  };

  const testGroqConnection = async () => {
    try {
      // Test Groq connection with a simple request
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: {
          'Authorization': `Bearer ${config.groqKey}`,
        },
      });
      
      if (response.ok) {
        toast({
          title: "✅ Groq Connected",
          description: "Groq API key is working correctly",
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      toast({
        title: "❌ Groq Connection Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const testMostlyAI = () => {
    // Update MOSTLY AI with the stripe key (if being used for synthetic data)
    syntheticDataService.setApiKey(config.stripeKey);
    toast({
      title: "✅ API Keys Updated",
      description: "Configuration has been refreshed across all services",
    });
  };

  const maskKey = (key: string) => {
    if (!key) return 'Not configured';
    return showKeys ? key : `${key.slice(0, 8)}...${key.slice(-8)}`;
  };

  return (
    <Card className="glass-card shadow-glass border border-glassBorder">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lime-400">
          <Key className="w-5 h-5" />
          API Configuration Status
          <Badge className="bg-green-900 text-green-300">Auto-Configured</Badge>
        </CardTitle>
        <p className="text-indigo-300 text-sm">
          Your API keys are pre-configured and ready to use
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* Groq API Status */}
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-white font-medium">Groq API</p>
                <p className="text-xs text-indigo-300">{maskKey(config.groqKey)}</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={testGroqConnection}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Test
            </Button>
          </div>

          {/* Stripe/MostlyAI Status */}
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-white font-medium">Stripe API</p>
                <p className="text-xs text-indigo-300">{maskKey(config.stripeKey)}</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={testMostlyAI}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Update
            </Button>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowKeys(!showKeys)}
            className="flex items-center gap-2"
          >
            {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showKeys ? 'Hide' : 'Show'} Keys
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={refreshConfig}
            className="text-lime-400 border-lime-400 hover:bg-lime-400 hover:text-slate-900"
          >
            Refresh Config
          </Button>
        </div>

        <div className="text-xs text-indigo-300 space-y-1 pt-3 border-t border-slate-700">
          <p>• Keys are embedded directly in the application</p>
          <p>• Groq: Powers DeepTalk AI conversations</p>
          <p>• Stripe: Used for synthetic data generation services</p>
          <p>• Configuration automatically applies across all services</p>
        </div>
      </CardContent>
    </Card>
  );
};
