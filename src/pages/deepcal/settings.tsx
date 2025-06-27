
// DeepCAL Engine Settings
import DeepCALSymbolicHeader from "@/components/DeepCALSymbolicHeader";
import { Settings, Sliders, Brain, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const EngineSettings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALSymbolicHeader />
      
      <main className="container max-w-6xl mx-auto pt-8 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-lime-400 via-cyan-400 to-purple-400">
            Engine Settings
          </h1>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto mb-6">
            Configure neural parameters, weights, and ethical considerations for optimal performance
          </p>
          <Badge variant="outline" className="border-lime-400 text-lime-400">
            <Settings className="w-4 h-4 mr-2" />
            Configuration Mode
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass-card shadow-glass border border-glassBorder">
            <CardHeader>
              <CardTitle className="text-lime-400 flex items-center gap-2">
                <Sliders className="w-6 h-6" />
                TOPSIS Criteria Weights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-indigo-300 mb-2 block">Cost Efficiency (35%)</Label>
                <Slider defaultValue={[35]} max={100} step={1} className="w-full" />
              </div>
              <div>
                <Label className="text-indigo-300 mb-2 block">Delivery Time (30%)</Label>
                <Slider defaultValue={[30]} max={100} step={1} className="w-full" />
              </div>
              <div>
                <Label className="text-indigo-300 mb-2 block">Reliability (25%)</Label>
                <Slider defaultValue={[25]} max={100} step={1} className="w-full" />
              </div>
              <div>
                <Label className="text-indigo-300 mb-2 block">Service Quality (10%)</Label>
                <Slider defaultValue={[10]} max={100} step={1} className="w-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-glass border border-glassBorder">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Brain className="w-6 h-6" />
                Neural Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-indigo-300 mb-2 block">Learning Rate (0.001)</Label>
                <Slider defaultValue={[0.001]} max={0.1} step={0.001} className="w-full" />
              </div>
              <div>
                <Label className="text-indigo-300 mb-2 block">Confidence Threshold (75%)</Label>
                <Slider defaultValue={[75]} max={100} step={1} className="w-full" />
              </div>
              <div>
                <Label className="text-indigo-300 mb-2 block">Grey Uncertainty Factor (0.3)</Label>
                <Slider defaultValue={[0.3]} max={1} step={0.1} className="w-full" />
              </div>
              <div>
                <Label className="text-indigo-300 mb-2 block">Neutrosophic Truth Weight (0.8)</Label>
                <Slider defaultValue={[0.8]} max={1} step={0.1} className="w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card shadow-glass border border-glassBorder mt-8">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Ethical & Safety Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-indigo-300">Emergency Priority Override</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-indigo-300">Environmental Impact Consideration</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-indigo-300">Fair Distribution Algorithm</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-indigo-300">Cost Transparency Reporting</Label>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-indigo-300">Bias Detection Active</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-indigo-300">Explainable AI Mode</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-indigo-300">Audit Trail Logging</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-indigo-300">Human Oversight Required</Label>
                  <Switch />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button className="bg-gradient-to-r from-lime-500 to-cyan-500 hover:from-lime-600 hover:to-cyan-600 text-black font-semibold px-8 py-3 mr-4">
            Apply Settings
          </Button>
          <Button variant="outline" className="border-indigo-600 text-indigo-300 hover:bg-indigo-800 px-8 py-3">
            Reset to Defaults
          </Button>
        </div>
      </main>
    </div>
  );
};

export default EngineSettings;
