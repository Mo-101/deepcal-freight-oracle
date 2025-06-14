
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Database, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { csvDataEngine } from '@/services/csvDataEngine';
import { humorToast } from '@/components/HumorToast';

interface CSVDataLoaderProps {
  onDataLoaded?: () => void;
}

const CSVDataLoader = ({ onDataLoaded }: CSVDataLoaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(csvDataEngine.isDataLoaded());
  const [dataStats, setDataStats] = useState<{ records: number; hash: string; source: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.tsv')) {
      humorToast("❌ Invalid Format", "Please upload a CSV or TSV file containing shipment data.", 3000);
      return;
    }

    setIsLoading(true);
    humorToast("📤 Loading Data", "Processing shipment records...", 2000);

    try {
      const text = await file.text();
      await csvDataEngine.loadCSVData(text, 'uploaded');
      
      const shipments = csvDataEngine.getShipments();
      const lineageMeta = csvDataEngine.getLineageMeta();
      
      setDataStats({
        records: shipments.length,
        hash: lineageMeta?.sha256.substring(0, 8) || 'unknown',
        source: lineageMeta?.source || 'uploaded'
      });
      setDataLoaded(true);
      onDataLoaded?.();
      
      humorToast("✅ Data Engine Online", `Successfully loaded ${shipments.length} shipment records!`, 3000);
    } catch (error) {
      humorToast("❌ Load Failed", (error as Error).message, 4000);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const loadEmbeddedData = async () => {
    setIsLoading(true);
    humorToast("🔄 Loading Embedded Data", "Initializing with DeepCAL embedded dataset...", 2000);

    try {
      await csvDataEngine.autoLoadEmbeddedData();
      
      const shipments = csvDataEngine.getShipments();
      const lineageMeta = csvDataEngine.getLineageMeta();
      
      setDataStats({
        records: shipments.length,
        hash: lineageMeta?.sha256.substring(0, 8) || 'unknown',
        source: lineageMeta?.source || 'embedded'
      });
      setDataLoaded(true);
      onDataLoaded?.();
      
      humorToast("✅ Embedded Data Loaded", `DeepCAL is now operational with ${shipments.length} real shipment records!`, 3000);
    } catch (error) {
      humorToast("❌ Embedded Load Failed", (error as Error).message, 4000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-6 h-6 text-blue-600" />
          DeepCAL Data Engine
        </CardTitle>
        <p className="text-muted-foreground">
          "Nothing Moves Without the Core" - Real data powers all features
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status */}
        <div className="flex items-center gap-3 p-4 rounded-lg border" 
             style={{ backgroundColor: dataLoaded ? '#f0f9ff' : '#fef3c7', borderColor: dataLoaded ? '#0ea5e9' : '#f59e0b' }}>
          {dataLoaded ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          )}
          <div>
            <div className="font-semibold">
              {dataLoaded ? "Data Engine: ONLINE" : "Data Engine: LOCKED"}
            </div>
            {dataStats && (
              <div className="text-sm text-muted-foreground">
                {dataStats.records} records loaded • Source: {dataStats.source} • Hash: {dataStats.hash}
              </div>
            )}
          </div>
        </div>

        {/* Upload Section */}
        <div className="space-y-4">
          <div className="text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.tsv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isLoading ? "Processing..." : "Upload CSV/TSV Data"}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Upload your shipment data file (CSV or TSV format)
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            onClick={loadEmbeddedData}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            <FileText className="w-4 h-4 mr-2" />
            Load Embedded Dataset
          </Button>
        </div>

        {/* Data Requirements */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Real Data Fields (No Mock Data):</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div>• request_reference</div>
            <div>• origin_country</div>
            <div>• destination_country</div>
            <div>• weight_kg</div>
            <div>• volume_cbm</div>
            <div>• freight_carrier_cost</div>
            <div>• date_of_collection</div>
            <div>• delivery_status</div>
          </div>
          <div className="mt-2 text-xs text-blue-600">
            ✨ All calculations use real shipment data - no mock values anywhere!
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVDataLoader;
