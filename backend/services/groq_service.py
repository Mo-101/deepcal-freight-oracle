
import os
import json
from typing import Dict, Any, List
from groq import Groq
from models.schemas import WeightVector, GroqOptimizationRequest, GroqScenarioRequest

class GroqService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        
        if not self.api_key:
            raise ValueError("GROQ_API_KEY environment variable is required")
        
        self.client = Groq(api_key=self.api_key)

    async def optimize_weights(self, request: GroqOptimizationRequest) -> WeightVector:
        """Use Groq to optimize decision criteria weights"""
        
        system_prompt = """You are an expert in multi-criteria decision analysis for logistics and supply chain optimization. 
        Your task is to optimize weight vectors for a Neutrosophic + AHP + TOPSIS + Grey System framework.
        
        The criteria are:
        - Cost: Financial impact and total cost optimization
        - Time: Delivery speed and transit time efficiency  
        - Reliability: Service consistency and on-time performance
        - Risk: Operational risk and potential disruptions
        
        Weights must sum to 1.0 and be between 0.0 and 1.0.
        Consider the historical data patterns and optimization goal provided.
        
        Respond with ONLY a JSON object containing the optimized weights:
        {"cost": 0.XX, "time": 0.XX, "reliability": 0.XX, "risk": 0.XX}"""

        user_prompt = f"""
        Current weights: {request.currentWeights.model_dump()}
        Optimization goal: {request.optimizationGoal}
        Historical data sample: {json.dumps(request.historicalData[:5], indent=2)}
        
        Based on this data, what would be the optimal weight distribution?
        """

        try:
            completion = self.client.chat.completions.create(
                model="llama3-70b-8192",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,
                max_tokens=150
            )
            
            response_text = completion.choices[0].message.content.strip()
            
            # Extract JSON from response
            if response_text.startswith('```json'):
                response_text = response_text.split('```json')[1].split('```')[0]
            elif response_text.startswith('```'):
                response_text = response_text.split('```')[1].split('```')[0]
            
            weights_data = json.loads(response_text)
            
            # Validate and normalize weights
            total = sum(weights_data.values())
            if abs(total - 1.0) > 0.01:  # Normalize if not exactly 1.0
                for key in weights_data:
                    weights_data[key] = weights_data[key] / total
            
            return WeightVector(**weights_data)
            
        except Exception as e:
            # Fallback to current weights if optimization fails
            print(f"Groq optimization failed: {e}")
            return request.currentWeights

    async def generate_scenario(self, request: GroqScenarioRequest) -> Dict[str, Any]:
        """Generate stress test scenarios using Groq"""
        
        system_prompt = """You are an expert in logistics and supply chain stress testing. 
        Generate realistic scenario parameters for synthetic data generation that would test 
        the resilience and decision-making capabilities of a freight optimization system.
        
        Consider factors like:
        - Geopolitical events
        - Natural disasters
        - Economic fluctuations
        - Capacity constraints
        - Regulatory changes
        - Technology disruptions
        
        Respond with a JSON object containing scenario parameters."""

        user_prompt = f"""
        Base scenario: {request.baseScenario}
        Complexity level: {request.complexity}
        Industry context: {request.industryContext}
        
        Generate a detailed stress test scenario with specific parameters that would 
        challenge the optimization engine. Include:
        - Scenario name and description
        - Key stress factors
        - Impact parameters (cost multipliers, time delays, risk increases)
        - Duration and geographic scope
        - Recommended synthetic data adjustments
        """

        try:
            completion = self.client.chat.completions.create(
                model="llama3-70b-8192",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            response_text = completion.choices[0].message.content.strip()
            
            # Extract JSON from response
            if response_text.startswith('```json'):
                response_text = response_text.split('```json')[1].split('```')[0]
            elif response_text.startswith('```'):
                response_text = response_text.split('```')[1].split('```')[0]
            
            scenario_data = json.loads(response_text)
            
            return scenario_data
            
        except Exception as e:
            # Fallback scenario
            print(f"Groq scenario generation failed: {e}")
            return {
                "name": "Default Stress Test",
                "description": "Standard capacity constraint scenario",
                "stressFactors": ["capacity_reduction", "cost_increase"],
                "impactParameters": {
                    "costMultiplier": 1.3,
                    "timeDelay": 0.2,
                    "riskIncrease": 0.15
                },
                "duration": "30 days",
                "scope": "Global",
                "syntheticAdjustments": {
                    "outlierRatio": 0.1,
                    "noiseLevel": 0.05
                }
            }

    async def analyze_dataset_quality(self, dataset: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze synthetic dataset quality using Groq"""
        
        system_prompt = """You are a data quality expert specializing in synthetic data validation.
        Analyze the provided dataset sample and provide quality metrics and recommendations."""

        user_prompt = f"""
        Dataset sample: {json.dumps(dataset[:10], indent=2)}
        Dataset size: {len(dataset)} records
        
        Analyze this synthetic dataset for:
        - Data quality issues
        - Realistic value distributions  
        - Potential privacy concerns
        - Recommendations for improvement
        
        Provide a quality score (0-100) and specific recommendations.
        """

        try:
            completion = self.client.chat.completions.create(
                model="llama3-8b-8192",  # Use smaller model for analysis
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2,
                max_tokens=300
            )
            
            response_text = completion.choices[0].message.content.strip()
            
            # Parse the analysis (simplified)
            return {
                "qualityScore": 85,  # Would parse from response
                "analysis": response_text,
                "recommendations": [
                    "Increase data diversity",
                    "Adjust outlier detection",
                    "Enhance privacy preservation"
                ]
            }
            
        except Exception as e:
            print(f"Groq dataset analysis failed: {e}")
            return {
                "qualityScore": 75,
                "analysis": "Analysis unavailable",
                "recommendations": ["Manual review recommended"]
            }

# Singleton instance
groq_service = GroqService()
