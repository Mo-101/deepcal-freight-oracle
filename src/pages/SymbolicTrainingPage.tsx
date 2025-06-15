import React, { useState, useEffect } from "react";
import {
  Brain,
  Cpu,
  Database,
  Bot,
  LineChart as LucideChartLine,
  FlaskConical,
  Mic,
  GitBranch,
  Zap,
  CloudUpload,
  CheckCircle,
  RefreshCw,
  Play,
  Redo,
  FileAudio,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeepCALHeader from "@/components/DeepCALHeader";

const lossData = Array.from({ length: 25 }, (_, i) => ({
  epoch: i + 1,
  loss: [
    0.85, 0.72, 0.63, 0.55, 0.48, 0.42, 0.37, 0.33, 0.29, 0.26,
    0.23, 0.21, 0.19, 0.17, 0.15, 0.14, 0.13, 0.12, 0.11, 0.10,
    0.095, 0.090, 0.085, 0.080, 0.075,
  ][i],
}));
const accuracyData = Array.from({ length: 25 }, (_, i) => ({
  epoch: i + 1,
  accuracy: [
    0.65, 0.71, 0.75, 0.78, 0.81, 0.83, 0.85, 0.86, 0.87, 0.88,
    0.89, 0.895, 0.90, 0.905, 0.91, 0.915, 0.917, 0.919, 0.921, 0.923,
    0.925, 0.927, 0.929, 0.931, 0.933
  ][i],
}));
const modelVersions = [
  { id: "v1.2.5", name: "v1.2.5", status: "active", accuracy: 92.4, data: "120K", groq: "v1.3" },
  { id: "v1.3.0", name: "v1.3.0", status: "training", accuracy: 89.7, data: "145K", groq: "v1.4" },
  { id: "v1.1.8", name: "v1.1.8", status: "archived", accuracy: 90.2, data: "98K", groq: "v1.2" },
];

const SymbolicTrainingPage: React.FC = () => {
  const [trainingProgress, setTrainingProgress] = useState(48);
  const [epoch, setEpoch] = useState(24);
  const [isTrainingActive, setIsTrainingActive] = useState(true);
  const [selectedModel, setSelectedModel] = useState("transformer");
  const [learningRate, setLearningRate] = useState(0.001);

  useEffect(() => {
    if (isTrainingActive) {
      const interval = setInterval(() => {
        setTrainingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsTrainingActive(false);
            return 100;
          }
          return prev + 0.5;
        });

        setEpoch((prev) => (prev < 50 ? prev + 1 : prev));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isTrainingActive]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
      <DeepCALHeader />
      <div className="container mx-auto px-4 py-8 bg-gray-900 text-gray-100 min-h-screen">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mr-4 shadow-[0_0_25px_rgba(139,92,246,0.5)]">
              <Brain className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                DeepCAL++
              </span>{" "}
              Symbolic Engine Training
            </h1>
          </div>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Train and optimize the symbolic intelligence engine with real-time feedback. Integrated with Groq NLU for advanced voice capabilities.
          </p>
          <div className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 h-1 w-32 mx-auto rounded-full"></div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <ModelConfigCard
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              learningRate={learningRate}
              setLearningRate={setLearningRate}
            />
            <DataUploadCard />
            <GroqIntegrationCard />
          </div>
          {/* Center/Right Columns */}
          <div className="lg:col-span-2 space-y-8">
            <TrainingVisualization
              trainingProgress={trainingProgress}
              isTrainingActive={isTrainingActive}
              epoch={epoch}
              lossData={lossData}
              accuracyData={accuracyData}
            />
            <ModelTesting />
            <VoiceInterfaceTesting />
          </div>
        </div>

        {/* Model Version Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-400 flex items-center justify-center">
            <GitBranch className="mr-2" /> Model Versions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modelVersions.map((version) => (
              <ModelVersionCard key={version.id} version={version} />
            ))}
          </div>
        </div>
        {/* Wave Animation style for voice viz */}
        <style>{`
          .animate-wave {
            background-size: 200% 100%;
            animation: wave 1.5s linear infinite;
          }
          @keyframes wave {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}</style>
      </div>
    </div>
  );
};

// Subcomponents

const ModelConfigCard: React.FC<{
  selectedModel: string;
  setSelectedModel: (s: string) => void;
  learningRate: number;
  setLearningRate: (n: number) => void;
}> = ({ selectedModel, setSelectedModel, learningRate, setLearningRate }) => {
  const models = [
    { id: "transformer", name: "Transformer", description: "Recommended" },
    { id: "lstm", name: "LSTM", description: "Sequence Models" },
    { id: "cnn", name: "CNN", description: "Spatial Analysis" },
    { id: "hybrid", name: "Hybrid", description: "Custom" },
  ];
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-blue-400 flex items-center">
          <Cpu className="mr-2" /> Model Architecture
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {models.map((model) => (
            <div
              key={model.id}
              className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${
                selectedModel === model.id
                  ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  : "border-gray-600"
              } bg-gray-700`}
              onClick={() => setSelectedModel(model.id)}
              tabIndex={0}
              role="button"
              aria-pressed={selectedModel === model.id}
            >
              <div className="text-lg font-medium mb-1">{model.name}</div>
              <div className="text-xs text-gray-400">{model.description}</div>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <Label className="text-gray-400 mb-2">Model Parameters</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-gray-500">Epochs</Label>
              <Input type="number" defaultValue={50} className="bg-gray-700 border-gray-600" />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Batch Size</Label>
              <Input type="number" defaultValue={32} className="bg-gray-700 border-gray-600" />
            </div>
          </div>
        </div>
        <div className="mb-6">
          <Label className="text-gray-400 mb-2">Learning Rate</Label>
          <div className="flex items-center">
            <Slider
              defaultValue={[learningRate * 10000]}
              min={1}
              max={100}
              step={1}
              onValueChange={(val) => setLearningRate(val[0] / 10000)}
              className="w-full"
            />
            <span className="ml-3 text-sm">{learningRate.toFixed(4)}</span>
          </div>
        </div>
        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Zap className="mr-2" /> Initialize Training
        </Button>
      </CardContent>
    </Card>
  );
};

const DataUploadCard: React.FC = () => (
  <Card className="bg-gray-800 border-gray-700">
    <CardHeader>
      <CardTitle className="text-green-400 flex items-center">
        <Database className="mr-2" /> Training Data
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center mb-4 cursor-pointer hover:border-green-500 transition-colors">
        <CloudUpload className="w-12 h-12 mx-auto text-gray-500 mb-3" />
        <p className="font-medium mb-1">Upload Training Dataset</p>
        <p className="text-gray-500 text-sm">CSV, JSON, or TXT formats</p>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
          <div>
            <div className="font-medium">logistics_data_v1.csv</div>
            <div className="text-xs text-gray-500">42.7 MB • 120,000 records</div>
          </div>
          <div className="text-green-500">
            <CheckCircle />
          </div>
        </div>
        <div className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
          <div>
            <div className="font-medium">africa_routes.json</div>
            <div className="text-xs text-gray-500">18.2 MB • 7,500 routes</div>
          </div>
          <div className="text-yellow-500">
            <RefreshCw className="animate-spin" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const GroqIntegrationCard: React.FC = () => (
  <Card className="bg-gray-800 border-gray-700">
    <CardHeader>
      <CardTitle className="text-purple-400 flex items-center">
        <Bot className="mr-2" /> Groq NLU Integration
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center mb-6">
        <div className="relative">
          <div className="w-3 h-3 bg-green-500 rounded-full absolute -left-4 top-1.5"></div>
        </div>
        <div className="text-green-400 font-medium">Connected to Groq API</div>
      </div>
      <div className="mb-4">
        <Label className="text-gray-400 mb-2">NLU Model</Label>
        <Select defaultValue="mixtral">
          <SelectTrigger className="bg-gray-700 border-gray-600">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="mixtral">Mixtral-8x7b (32k context)</SelectItem>
            <SelectItem value="llama">LLaMA2-70b (4k context)</SelectItem>
            <SelectItem value="gemma">Gemma-7b-it</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mb-6">
        <Label className="text-gray-400 mb-2">Voice Model Parameters</Label>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-500">Response Quality</span>
              <span className="text-xs">High</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "90%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-500">Latency</span>
              <span className="text-xs">Low</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: "30%" }}></div>
            </div>
          </div>
        </div>
      </div>
      <Button className="w-full bg-gray-700 hover:bg-gray-600">
        <RefreshCw className="mr-2" /> Sync Voice Model
      </Button>
    </CardContent>
  </Card>
);

const TrainingVisualization: React.FC<{
  trainingProgress: number;
  isTrainingActive: boolean;
  epoch: number;
  lossData: Array<{ epoch: number; loss: number }>;
  accuracyData: Array<{ epoch: number; accuracy: number }>;
}> = ({
  trainingProgress,
  isTrainingActive,
  epoch,
  lossData,
  accuracyData,
}) => (
  <Card className="bg-gray-800 border-gray-700">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="text-blue-400 flex items-center">
          <LucideChartLine className="mr-2" /> Training Progress
        </CardTitle>
        <div
          className={`flex items-center bg-gray-700 px-3 py-1 rounded-full ${
            isTrainingActive ? "text-green-500" : "text-gray-500"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full mr-2 ${
              isTrainingActive ? "bg-green-500" : "bg-gray-500"
            }`}
          ></div>
          <span className="text-sm">
            {isTrainingActive ? "Training Active" : "Training Paused"}
          </span>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span>Epoch {epoch}/50</span>
          <span>{Math.round(trainingProgress)}% Complete</span>
        </div>
        <Progress value={trainingProgress} className="h-3 bg-gray-700" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="text-center font-medium mb-2">Loss</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lossData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="epoch" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#4b5563" }} />
              <Line
                type="monotone"
                dataKey="loss"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ stroke: "#ef4444", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2, fill: "#1f2937" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div className="text-center font-medium mb-2">Accuracy</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="epoch" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0.6, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
              <Tooltip
                formatter={value => [`${(Number(value) * 100).toFixed(1)}%`, "Accuracy"]}
                contentStyle={{ backgroundColor: "#1f2937", borderColor: "#4b5563" }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ stroke: "#10b981", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "#1f2937" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-400">{epoch}</div>
          <div className="text-xs text-gray-400">Epochs</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-400">92.4%</div>
          <div className="text-xs text-gray-400">Accuracy</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-400">0.043</div>
          <div className="text-xs text-gray-400">Loss</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-400">32m</div>
          <div className="text-xs text-gray-400">Remaining</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ModelTesting: React.FC = () => {
  const [inputText, setInputText] = useState(
    "Calculate freight cost from Lagos to Nairobi for 500kg electronics"
  );
  const [outputText, setOutputText] = useState("");
  const runTest = () => {
    setOutputText(
      `Symbolic Intelligence Output:
Route: Lagos → Mombasa (Sea) → Nairobi (Road)
Estimated Cost: $3,200 USD
Transit Time: 14 days
Reliability: 92%
Recommended Carrier: Safmarine`
    );
  };
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center">
          <FlaskConical className="mr-2" /> Model Testing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label className="text-gray-400 mb-2">Input</Label>
            <textarea
              className="w-full h-40 bg-gray-700 border border-gray-600 rounded-lg p-4 text-gray-100"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Enter test scenario..."
            />
          </div>
          <div>
            <Label className="text-gray-400 mb-2">Model Output</Label>
            <div className="w-full h-40 bg-gray-700 border border-gray-600 rounded-lg p-4 overflow-auto text-gray-100 whitespace-pre-line">
              {outputText || "Run test to see output..."}
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={runTest}>
            <Play className="mr-2" /> Run Test
          </Button>
          <Button className="flex-1 bg-gray-700 hover:bg-gray-600" onClick={() => setOutputText("")}>
            <Redo className="mr-2" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const VoiceInterfaceTesting: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-purple-400 flex items-center">
          <Mic className="mr-2" /> Voice Interface Testing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="font-medium">DeepCAL Voice Assistant</div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isListening ? "bg-green-500" : "bg-gray-500"
              }`}></div>
              <span className="text-xs">{isListening ? "Listening" : "Idle"}</span>
            </div>
          </div>
          <div className="h-1 mb-1 rounded bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-wave"></div>
          <div className="text-xs text-gray-500 text-right">
            {isListening ? "Processing voice input..." : "Press start to begin"}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label className="text-gray-400 mb-2">Voice Input</Label>
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 min-h-[120px]">
              {"What's the cheapest freight option from Durban to Cairo for 2 tons of textiles?"}
            </div>
          </div>
          <div>
            <Label className="text-gray-400 mb-2">Groq NLU Parsing</Label>
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 min-h-[120px]">
              <div className="text-sm">
                <p><span className="text-purple-400">Intent:</span> Freight Cost Calculation</p>
                <p><span className="text-purple-400">Origin:</span> Durban, South Africa</p>
                <p><span className="text-purple-400">Destination:</span> Cairo, Egypt</p>
                <p><span className="text-purple-400">Weight:</span> 2 tons</p>
                <p><span className="text-purple-400">Goods Type:</span> Textiles</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <Button
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            onClick={() => setIsListening(!isListening)}
          >
            <Mic className="mr-2" />{isListening ? "Stop Test" : "Start Voice Test"}
          </Button>
          <Button className="flex-1 bg-gray-700 hover:bg-gray-600">
            <FileAudio className="mr-2" /> Sample Inputs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ModelVersionCard: React.FC<{
  version: {
    id: string;
    name: string;
    status: string;
    accuracy: number;
    data: string;
    groq: string;
  };
}> = ({ version }) => {
  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    active: { bg: "bg-green-900", text: "text-green-400", border: "border-green-500" },
    training: { bg: "bg-blue-900", text: "text-blue-400", border: "border-blue-500" },
    archived: { bg: "bg-gray-700", text: "text-gray-400", border: "border-gray-600" },
  };
  const color = statusColors[version.status] || statusColors["archived"];
  return (
    <Card className={`bg-gray-800 border ${color.border}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{version.name}</CardTitle>
            <div className="text-sm text-gray-400 capitalize">
              {version.status === "training"
                ? "Training in Progress"
                : version.status}
            </div>
          </div>
          <span className={`${color.bg} ${color.text} text-xs px-2 py-1 rounded-full`}>
            {version.status === "training"
              ? "Training"
              : version.status === "active"
              ? "Active"
              : "Archived"}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm mb-4">
          <div className="flex justify-between mb-1">
            <span>Accuracy:</span>
            <span
              className={`font-medium ${
                version.status === "training" ? "text-blue-400" : ""
              }`}
            >
              {version.accuracy}%
            </span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Training Data:</span>
            <span className="font-medium">{version.data} records</span>
          </div>
          <div className="flex justify-between">
            <span>Groq Compatibility:</span>
            <span className="font-medium">{version.groq}</span>
          </div>
        </div>
        <Button className="w-full bg-gray-700 hover:bg-gray-600">
          {version.status === "training"
            ? "Monitor Training"
            : version.status === "active"
            ? "View Details"
            : "Restore Version"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SymbolicTrainingPage;
