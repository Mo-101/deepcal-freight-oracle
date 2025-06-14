
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, Database, Zap, Activity, Target } from "lucide-react"

interface EngineMetrics {
  trainingProgress: number
  accuracy: number
  dataProcessed: number
  predictionsGenerated: number
  learningRate: number
  modelVersion: string
  lastTrainingSession: string
  confidenceScore: number
}

export function DeepCALEngineAnalytics() {
  const [metrics, setMetrics] = useState<EngineMetrics>({
    trainingProgress: 0,
    accuracy: 0,
    dataProcessed: 0,
    predictionsGenerated: 0,
    learningRate: 0,
    modelVersion: "1.0.0",
    lastTrainingSession: "",
    confidenceScore: 0,
  })
  const [isTraining, setIsTraining] = useState(false)
  const [trainingLogs, setTrainingLogs] = useState<string[]>([])

  useEffect(() => {
    // Initialize with some baseline metrics
    setMetrics({
      trainingProgress: 75,
      accuracy: 87.3,
      dataProcessed: 125000,
      predictionsGenerated: 8432,
      learningRate: 0.001,
      modelVersion: "2.1.3",
      lastTrainingSession: new Date().toISOString(),
      confidenceScore: 92.1,
    })

    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        predictionsGenerated: prev.predictionsGenerated + Math.floor(Math.random() * 5),
        accuracy: Math.min(99.9, prev.accuracy + (Math.random() - 0.5) * 0.1),
        confidenceScore: Math.min(99.9, prev.confidenceScore + (Math.random() - 0.5) * 0.2),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const startTraining = async () => {
    setIsTraining(true)
    setTrainingLogs([])

    const logs = [
      "Initializing DeepCAL training session...",
      "Loading synthetic dataset (500,000 records)...",
      "Preprocessing freight data...",
      "Applying feature engineering...",
      "Starting neural network training...",
      "Epoch 1/100 - Loss: 0.234, Accuracy: 89.2%",
      "Epoch 25/100 - Loss: 0.156, Accuracy: 91.7%",
      "Epoch 50/100 - Loss: 0.098, Accuracy: 94.1%",
      "Epoch 75/100 - Loss: 0.067, Accuracy: 96.3%",
      "Epoch 100/100 - Loss: 0.045, Accuracy: 97.8%",
      "Training completed successfully!",
      "Model validation in progress...",
      "Updating prediction algorithms...",
      "DeepCAL engine enhanced!",
    ]

    for (let i = 0; i < logs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setTrainingLogs((prev) => [...prev, logs[i]])
      setMetrics((prev) => ({
        ...prev,
        trainingProgress: Math.min(100, ((i + 1) / logs.length) * 100),
        accuracy: Math.min(97.8, prev.accuracy + 0.5),
        dataProcessed: prev.dataProcessed + 5000,
      }))
    }

    setIsTraining(false)
    setMetrics((prev) => ({
      ...prev,
      modelVersion: `${prev.modelVersion.split(".")[0]}.${Number.parseInt(prev.modelVersion.split(".")[1]) + 1}.0`,
      lastTrainingSession: new Date().toISOString(),
    }))
  }

  return (
    <div className="space-y-6 font-space">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gradient-blue flex items-center gap-2">
            <Brain className="h-8 w-8" />
            DeepCAL Engine Analytics
          </h2>
          <p className="text-muted-foreground mt-2 font-inter">Real-time AI engine performance and training metrics</p>
        </div>
        <Button
          onClick={startTraining}
          disabled={isTraining}
          className="glass-button font-medium"
        >
          {isTraining ? "Training..." : "Start Training"}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 font-inter">
              <Target className="h-4 w-4" />
              Model Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="data-value text-green-400">{metrics.accuracy.toFixed(1)}%</div>
            <Progress value={metrics.accuracy} className="mt-2 animate-progress" />
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 font-inter">
              <Database className="h-4 w-4" />
              Data Processed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="data-value text-blue-400">{metrics.dataProcessed.toLocaleString()}</div>
            <p className="data-label mt-1">Records analyzed</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 font-inter">
              <Zap className="h-4 w-4" />
              Predictions Made
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="data-value text-yellow-400">{metrics.predictionsGenerated.toLocaleString()}</div>
            <p className="data-label mt-1">Total predictions</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 font-inter">
              <Activity className="h-4 w-4" />
              Confidence Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="data-value text-purple-400">{metrics.confidenceScore.toFixed(1)}%</div>
            <Progress value={metrics.confidenceScore} className="mt-2 animate-progress" />
          </CardContent>
        </Card>
      </div>

      {/* Training Progress */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-gradient-blue flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Training Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-foreground font-inter">Current Training Session</span>
              <Badge variant={isTraining ? "default" : "secondary"} className="font-inter">
                {isTraining ? "Active" : "Idle"}
              </Badge>
            </div>
            <Progress value={metrics.trainingProgress} className="h-2 animate-progress" />
            <div className="flex justify-between text-sm text-muted-foreground font-inter">
              <span>Progress: {metrics.trainingProgress.toFixed(1)}%</span>
              <span>Model Version: {metrics.modelVersion}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Logs */}
      {trainingLogs.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-gradient-blue">Training Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/50 rounded-lg p-4 max-h-64 overflow-y-auto cyber-border">
              <div className="font-mono text-sm space-y-1">
                {trainingLogs.map((log, index) => (
                  <div key={index} className="text-green-400">
                    <span className="text-muted-foreground">[{new Date().toLocaleTimeString()}]</span> {log}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Engine Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-gradient-blue">Engine Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between font-inter">
                <span className="text-foreground">Learning Rate:</span>
                <span className="text-blue-400">{metrics.learningRate}</span>
              </div>
              <div className="flex justify-between font-inter">
                <span className="text-foreground">Last Training:</span>
                <span className="text-green-400">{new Date(metrics.lastTrainingSession).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-inter">
                <span className="text-foreground">Status:</span>
                <Badge className="bg-green-900 text-green-300">Operational</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-gradient-blue">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between font-inter">
                <span className="text-foreground">Avg Response Time:</span>
                <span className="text-blue-400">127ms</span>
              </div>
              <div className="flex justify-between font-inter">
                <span className="text-foreground">Memory Usage:</span>
                <span className="text-yellow-400">2.3GB / 8GB</span>
              </div>
              <div className="flex justify-between font-inter">
                <span className="text-foreground">CPU Usage:</span>
                <span className="text-purple-400">34%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
