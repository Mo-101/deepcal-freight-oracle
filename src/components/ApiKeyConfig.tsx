import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Key, CheckCircle, AlertTriangle, Save } from 'lucide-react';

interface ApiKeyConfigProps {
  onApiKeyChange?: (apiKey: string) => void;
}

export function ApiKeyConfig({ onApiKeyChange }: ApiKeyConfigProps) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Load saved API key from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('mostlyai-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      validateApiKey(savedApiKey);
    }
  }, []);

  const validateApiKey = async (key: string) => {
    if (!key || key.length < 10) {
      setIsValid(false);
      return;
    }

    setIsValidating(true);
    
    // Simulate API key validation
    setTimeout(() => {
      // Simple validation - check if it looks like a valid API key format
      const isValidFormat = /^[a-zA-Z0-9_-]{20,}$/.test(key);
      setIsValid(isValidFormat);
      setIsValidating(false);
    }, 1000);
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setIsValid(null);
    
    // Debounce validation
    const timeoutId = setTimeout(() => {
      validateApiKey(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleSave = () => {
    if (apiKey) {
      localStorage.setItem('mostlyai-api-key', apiKey);
      onApiKeyChange?.(apiKey);
    }
  };

  const getStatusBadge = () => {
    if (isValidating) {
      return (
        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          Validating...
        </Badge>
      );
    }
    
    if (isValid === true) {
      return (
        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          Valid
        </Badge>
      );
    }
    
    if (isValid === false) {
      return (
        <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Invalid
        </Badge>
      );
    }
    
    return null;
  };

  return (
    <Card className="bg-white/10 border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5 text-lime-400" />
          MostlyAI API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="api-key" className="text-sm text-indigo-200">
              API Key
            </Label>
            {getStatusBadge()}
          </div>
          
          <div className="relative">
            <Input
              id="api-key"
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="Enter your MostlyAI API key"
              className="pr-10 bg-white/5 border-white/20 text-white placeholder:text-indigo-300"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? (
                <EyeOff className="h-4 w-4 text-indigo-300" />
              ) : (
                <Eye className="h-4 w-4 text-indigo-300" />
              )}
            </Button>
          </div>
          
          <p className="text-xs text-indigo-300">
            Your API key is stored locally and used to authenticate with MostlyAI services.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={!apiKey || isValid === false}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
          
          {apiKey && (
            <Button
              onClick={() => {
                setApiKey('');
                localStorage.removeItem('mostlyai-api-key');
                setIsValid(null);
                onApiKeyChange?.('');
              }}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Clear
            </Button>
          )}
        </div>

        <div className="pt-2 border-t border-white/10">
          <div className="text-xs text-indigo-300 space-y-1">
            <p>• Get your API key from the MostlyAI dashboard</p>
            <p>• API key should be at least 20 characters long</p>
            <p>• Keys are validated automatically when entered</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}