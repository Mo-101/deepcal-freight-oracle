import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Database,
  Loader2,
  X
} from 'lucide-react';

interface DataStatus {
  loaded: boolean;
  version?: string;
  hash?: string;
  source?: string;
}

interface DataLoaderPanelProps {
  dataStatus: DataStatus;
  onValidated: (status: DataStatus) => void;
}

export default function DataLoaderPanel({ dataStatus, onValidated }: DataLoaderPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    
    processFile(file);
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simulate file processing with progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      // Simulate file validation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Generate mock data status
      const newStatus: DataStatus = {
        loaded: true,
        version: '1.0.0',
        hash: Math.random().toString(36).substring(2, 15),
        source: file.name
      };

      setTimeout(() => {
        onValidated(newStatus);
        setIsProcessing(false);
        setUploadProgress(0);
      }, 500);

    } catch (err) {
      setError('Failed to process file. Please try again.');
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const clearData = () => {
    onValidated({ loaded: false });
    setError(null);
  };

  if (dataStatus.loaded) {
    return (
      <Card className="bg-white/10 border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-lime-400" />
            Data Loaded Successfully
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">Ready for analysis</span>
              </div>
              <div className="text-xs text-indigo-300 space-y-1">
                <div>Source: {dataStatus.source}</div>
                <div>Version: {dataStatus.version}</div>
                <div>Hash: {dataStatus.hash}</div>
              </div>
            </div>
            <Button
              onClick={clearData}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Data
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-lime-400" />
          Data Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-lime-400 bg-lime-400/10'
              : 'border-white/30 hover:border-white/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isProcessing ? (
            <div className="space-y-4">
              <Loader2 className="w-8 h-8 mx-auto text-lime-400 animate-spin" />
              <div className="space-y-2">
                <p className="text-sm text-white">Processing file...</p>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-indigo-300">{uploadProgress.toFixed(0)}% complete</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <FileText className="w-12 h-12 mx-auto text-indigo-300" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-white">
                  Drop your CSV file here
                </p>
                <p className="text-sm text-indigo-300">
                  or click to browse files
                </p>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-lime-600 hover:bg-lime-700 text-black"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-sm text-red-400">{error}</span>
            <Button
              onClick={() => setError(null)}
              variant="ghost"
              size="sm"
              className="ml-auto h-6 w-6 p-0 text-red-400 hover:text-red-300"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* Requirements */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white">Requirements:</h4>
          <div className="text-xs text-indigo-300 space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                CSV
              </Badge>
              <span>Comma-separated values format</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                &lt;10MB
              </Badge>
              <span>Maximum file size</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                Headers
              </Badge>
              <span>First row should contain column names</span>
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}