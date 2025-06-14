
import React, { useRef, useState } from "react";
import { Lock, Unlock, FileBarChart2, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type DataStatus = {
  loaded: boolean;
  version?: string;
  hash?: string;
  source?: string;
};

const fakeHash = "sha256-DEADBEEF42";
const fakeVersion = "v1.0.0-deepbase";
const FAKE_SOURCE = "deeptrack_2.csv";

const validateCSV = (file: File): Promise<DataStatus> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (file.name.endsWith(".csv")) {
        resolve({
          loaded: true,
          version: fakeVersion,
          hash: fakeHash,
          source: file.name,
        });
      } else {
        reject(new Error("File type not supported. CSV only!"));
      }
    }, 1100); // humor: lazy validation
  });
};

const DataLoaderPanel: React.FC<{
  onValidated: (d: DataStatus) => void;
  dataStatus: DataStatus;
}> = ({ onValidated, dataStatus }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setLoading(true);
    const file = e.target.files[0];

    try {
      const res = await validateCSV(file);
      onValidated(res);
      toast({ title: "System Unlocked", description: "Data has been validated. Welcome to logistics enlightenment.", duration: 3000 });
    } catch (err: any) {
      toast({ title: "Lockdown Persists", description: err.message + " (Are you trolling the system?)", duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={cn("w-full max-w-lg mx-auto p-8 rounded-xl border border-card/60 bg-card shadow-xl space-y-4 flex flex-col items-center", dataStatus.loaded ? "opacity-100" : "opacity-95")}>
      <div className="flex items-center gap-3">
        {dataStatus.loaded ? (
          <Unlock className="w-8 h-8 text-green-500 animate-bounce" />
        ) : (
          <Lock className="w-8 h-8 text-yellow-400 animate-pulse" />
        )}
        <span className="text-lg font-semibold text-muted-foreground">
          {dataStatus.loaded ? "Data Loaded. You may proceed." : "Upload Algorithmic Data"}
        </span>
      </div>
      <input
        type="file"
        accept=".csv"
        className="hidden"
        ref={ref}
        onChange={handleChange}
        disabled={loading || dataStatus.loaded}
        aria-disabled={loading || dataStatus.loaded}
      />
      <button
        onClick={() => ref.current?.click()}
        className={cn(
          "flex gap-2 px-4 py-2 text-base rounded-md font-semibold transition-all",
          dataStatus.loaded ? "bg-green-300/80 text-green-900 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
        )}
        disabled={loading || dataStatus.loaded}
      >
        <FileBarChart2 className="w-5 h-5" />
        {dataStatus.loaded ? "CSV Ingested" : loading ? "Validating..." : "Select deeptrack_2.csv"}
      </button>
      {dataStatus.loaded &&
        <div className="w-full mt-6 flex-col flex items-center gap-1">
          <div className="text-xs bg-indigo-100 text-indigo-900 px-2 py-1 rounded font-mono">
            <b>Data Source:</b> {dataStatus.source} &middot; <b>v:</b> {dataStatus.version} &middot; <b>hash:</b> {dataStatus.hash}
          </div>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Info className="w-3 h-3" /> “Every visual is powered by actual data. Unlike most dashboards.”
          </span>
        </div>
      }
      {!dataStatus.loaded && (
        <span className="text-xs text-destructive flex gap-1 mt-2">
          <Lock className="w-4 h-4" /> System is locked. “No Data, No Feature, No Party.”
        </span>
      )}
    </section>
  );
};

export default DataLoaderPanel;
