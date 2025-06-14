
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Database, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { csvDataEngine } from '@/services/csvDataEngine';
import { humorToast } from '@/components/HumorToast';

const CSVDataLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(csvDataEngine.isDataLoaded());
  const [dataStats, setDataStats] = useState<{ records: number; hash: string } | null>(null);
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
      await csvDataEngine.loadCSVData(text);
      
      const shipments = csvDataEngine.getShipments();
      setDataStats({
        records: shipments.length,
        hash: csvDataEngine.getDataHash().substring(0, 8)
      });
      setDataLoaded(true);
      
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

  const loadSampleData = async () => {
    setIsLoading(true);
    humorToast("🔄 Loading Sample Data", "Initializing with DeepCAL sample dataset...", 2000);

    try {
      // Sample CSV data based on your format
      const sampleCSV = `date_of_greenlight_to_pickup	date_of_collection	request_reference	cargo_description	item_category	origin_country	origin_latitude	origin_longitude	destination_country	destination_latitude	destination_longitude	carrier	freight_carrier+cost	kuehne_nagel	scan_global_logistics	dhl_express	dhl_global	bwosi	agl	siginon	frieght_in_time	weight_kg	volume_cbm	initial_quote_awarded	final_quote_awarded_freight_forwader_Carrier	comments	date_of_arrival_destination	delivery_status	mode_of_shipment
	11-Jan-24	SR_24-001_NBO hub_Zimbabwe	Cholera kits and Tents	Emergency Health Kits	Kenya	36.990054	1.2404475	Zimbabwe	31.08848075	-17.80269125	Kenya Airways	18681	18681	0	0	0	0	0	0	0	7352.98	24.68	Kuehne Nagel	Kenya Airways	Kenya Airways via Kuehne Nagel	17-Jan-24	Delivered	Air
	11-Jan-24	SR_24-002_NBO hub_Zambia_(SR_23-144)	Cholera kitsORSBody bagsMasks and Glucometers	Emergency Health Kits	Kenya	36.990054	1.2404475	Zambia	28.3174378	15.4136414	Kenya Airways	35000	59500	0	0	0	0	0	0	29972	14397.00	50.88	Kuehne Nagel	Kenya Airways	Kenya Airways via Kuehne Nagel	01-Dec-24	Delivered	Air
	02-Feb-24	SR_24-004_NBO hub_Zambia	Tents GlovesPPEs and Drugs 	Field Support Material	Kenya	36.990054	1.2404475	Zambia	28.3174378	15.4136414	Kenya Airways	56800	0	0	0	0	0	0	0	0	10168.00	59.02	KQ:Direct charter	KQ:Direct charter	KQ:Direct charter	02-Jun-24	Delivered	Air
	08-Feb-24	SR_24-008_NBO hub_Madagascar	Laboratory Items	Lab & Diagnostics	Kenya	36.990054	1.2404475	Madagascar	47.50866443	-14.71204234	Kenya Airways	466	466	1029	0	0	0	0	0	574	179.33	2.71	Kuehne Nagel	Kenya Airways	Kenya Airways via Kuehne Nagel	02-Sept-24	Delivered	Air
	15-Feb-24	 SR_24-011_NBO hub_Comoros	Laboratory itemsKit Cholera and Sprayers	Lab & Diagnostics	Kenya	36.990054	1.2404475	Comoros	43.2413774	11.7209701	Kenya Airways	3480.00	679	781	0	0	0	0	0	521	1289.00	5.93	 Freight in Time	Kenya Airways	Kenya Airways via Freight in Time	16-Feb-24	Delivered	Air`;

      await csvDataEngine.loadCSVData(sampleCSV);
      
      const shipments = csvDataEngine.getShipments();
      setDataStats({
        records: shipments.length,
        hash: csvDataEngine.getDataHash().substring(0, 8)
      });
      setDataLoaded(true);
      
      humorToast("✅ Sample Data Loaded", `DeepCAL is now operational with ${shipments.length} sample records!`, 3000);
    } catch (error) {
      humorToast("❌ Sample Load Failed", (error as Error).message, 4000);
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
          "Nothing Moves Without the Core" - Load your shipment data to unlock all features
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
                {dataStats.records} records loaded • Hash: {dataStats.hash}
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
            onClick={loadSampleData}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            <FileText className="w-4 h-4 mr-2" />
            Load Sample Data
          </Button>
        </div>

        {/* Data Requirements */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Required Data Fields:</h4>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVDataLoader;
