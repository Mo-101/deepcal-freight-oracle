
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime
from enum import Enum

class JobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class PrivacyLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class ScenarioType(str, Enum):
    HISTORICAL = "historical"
    STRESS_TEST = "stress_test"
    SEASONAL_VARIATION = "seasonal_variation"

class SyntheticDataConfig(BaseModel):
    baseDatasetSize: int = Field(ge=100, le=10000)
    syntheticRatio: float = Field(ge=1.0, le=10.0)
    privacyLevel: PrivacyLevel
    scenarioType: ScenarioType

class GenerationJob(BaseModel):
    id: str
    status: JobStatus
    progress: int = Field(ge=0, le=100)
    config: SyntheticDataConfig
    createdAt: datetime
    completedAt: Optional[datetime] = None
    recordsGenerated: Optional[int] = None
    error: Optional[str] = None

class PrivacyMetrics(BaseModel):
    kAnonymity: int
    lDiversity: int
    tCloseness: float

class DatasetMetadata(BaseModel):
    generatedAt: datetime
    recordCount: int
    sourceHash: str
    scenario: str
    privacyMetrics: PrivacyMetrics

class SyntheticDataset(BaseModel):
    id: str
    jobId: str
    records: List[Dict[str, Any]]
    metadata: DatasetMetadata

class WeightVector(BaseModel):
    cost: float = Field(ge=0.0, le=1.0)
    time: float = Field(ge=0.0, le=1.0)
    reliability: float = Field(ge=0.0, le=1.0)
    risk: float = Field(ge=0.0, le=1.0)

class TrainingJobRequest(BaseModel):
    datasetId: str
    weights: WeightVector
    modelType: str = "neutrosophic"

class TrainingJob(BaseModel):
    id: str
    status: JobStatus
    progress: int = Field(ge=0, le=100)
    datasetId: str
    weights: WeightVector
    createdAt: datetime
    completedAt: Optional[datetime] = None
    accuracy: Optional[float] = None
    error: Optional[str] = None

class GroqOptimizationRequest(BaseModel):
    currentWeights: WeightVector
    historicalData: List[Dict[str, Any]]
    optimizationGoal: str = "balanced"

class GroqScenarioRequest(BaseModel):
    baseScenario: str
    complexity: Literal["simple", "moderate", "complex"] = "moderate"
    industryContext: str = "logistics"
