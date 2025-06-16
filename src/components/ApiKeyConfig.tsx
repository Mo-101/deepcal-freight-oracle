
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Key, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';
import { syntheticDataService } from '@/services/syntheticDataService';
import { humorToast } from './HumorToast';

export const ApiKeyConfig: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isConfigured, setIsConfigured] = useState(syntheticDataService.isApiKeyConfigured());

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      humorToast("❌ Empty Key", "Please enter your MOSTLY AI API key", 3000);
      return;
    }

    syntheticDataService.setApiKey(apiKey.trim());
    setIsConfigured(true);
    setApiKey('');
    humorToast("✅ API Key Saved", "MOSTLY AI integration is now ready!", 3000);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('mostlyai-api-key');
    setIsConfigured(false);
    setApiKey('');
    humorToast("🗑️ API Key Cleared", "You'll need to reconfigure to use synthetic data generation", 3000);
  };

  return (
    <Card className="glass-card shadow-glass border border-glassBorder">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lime-400">
          <Key className="w-5 h-5" />
          MOSTLY AI Configuration
          {isConfigured && <Badge className="bg-green-900 text-green-300">Configured</Badge>}
          {!isConfigured && <Badge variant="outline" className="border-yellow-400 text-yellow-400">Not Configured</Badge>}
        </CardTitle>
        <p className="text-indigo-300 text-sm">
          Configure your MOSTLY AI API key to enable synthetic data generation
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConfigured ? (
          <>
            <div>
              <Label className="block text-sm font-medium text-indigo-300 mb-2">
                API Key
              </Label>
              <div className="relative">
                <Input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your MOSTLY AI API key"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 hover:text-white"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSaveApiKey} className="bg-lime-400 hover:bg-lime-500 text-slate-900">
                <CheckCircle className="w-4 h-4 mr-2" />
                Save API Key
              </Button>
            </div>

            <div className="text-xs text-indigo-300 space-y-1">
              <p>• API key is stored locally in your browser</p>
              <p>• Get your key from: <span className="text-lime-400">https://app.mostly.ai</span></p>
              <p>• Enter your complete API key as provided by MOSTLY AI</p>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span>API key is configured and ready</span>
            </div>
            
            <Button 
              onClick={handleClearApiKey} 
              variant="outline" 
              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-slate-900"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Clear API Key
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
