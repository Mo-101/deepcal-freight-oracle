
// Causal Intelligence Core for DeepCAL Symbolic Mind
// Enables cause-effect reasoning and intervention planning

export interface SymbolicNode {
  id: string;
  label: string;
  description: string;
  type: 'condition' | 'action' | 'outcome';
  probability: number; // 0-1 likelihood of occurrence
}

export interface CausalEdge {
  from: string;
  to: string;
  causeType: 'mechanical' | 'human' | 'environmental' | 'economic';
  strength: number; // 0-1 causal influence strength
  confidence: number; // 0-1 confidence in relationship
  delay: number; // time delay in hours
}

export interface CausalGraph {
  nodes: SymbolicNode[];
  edges: CausalEdge[];
}

export interface InterventionPlan {
  targetNode: string;
  interventions: {
    nodeId: string;
    action: string;
    expectedImpact: number;
    cost: number;
  }[];
  totalExpectedReduction: number;
}

export class CausalGraphEngine {
  private graph: CausalGraph;

  constructor(initialGraph?: CausalGraph) {
    this.graph = initialGraph || this.createDefaultLogisticsGraph();
  }

  // Trace root causes of an effect
  traceCauses(effectId: string, maxDepth: number = 3): string[] {
    const visited = new Set<string>();
    const causes: string[] = [];

    const dfs = (nodeId: string, depth: number) => {
      if (depth >= maxDepth || visited.has(nodeId)) return;
      visited.add(nodeId);

      const incomingEdges = this.graph.edges.filter(edge => edge.to === nodeId);
      
      for (const edge of incomingEdges) {
        causes.push(edge.from);
        dfs(edge.from, depth + 1);
      }
    };

    dfs(effectId, 0);
    return [...new Set(causes)]; // Remove duplicates
  }

  // Predict downstream effects of a change
  predictEffects(causeId: string, maxDepth: number = 3): SymbolicNode[] {
    const visited = new Set<string>();
    const effects: SymbolicNode[] = [];

    const dfs = (nodeId: string, depth: number) => {
      if (depth >= maxDepth || visited.has(nodeId)) return;
      visited.add(nodeId);

      const outgoingEdges = this.graph.edges.filter(edge => edge.from === nodeId);
      
      for (const edge of outgoingEdges) {
        const effectNode = this.graph.nodes.find(n => n.id === edge.to);
        if (effectNode) {
          effects.push(effectNode);
          dfs(edge.to, depth + 1);
        }
      }
    };

    dfs(causeId, 0);
    return effects;
  }

  // Generate intervention plans to mitigate negative outcomes
  planIntervention(problemNodeId: string): InterventionPlan {
    const rootCauses = this.traceCauses(problemNodeId, 2);
    const interventions = rootCauses.map(causeId => {
      const node = this.graph.nodes.find(n => n.id === causeId);
      const edge = this.graph.edges.find(e => e.to === problemNodeId && e.from === causeId);
      
      return {
        nodeId: causeId,
        action: this.generateInterventionAction(causeId),
        expectedImpact: (edge?.strength || 0.5) * (edge?.confidence || 0.7),
        cost: this.estimateInterventionCost(causeId)
      };
    });

    const totalExpectedReduction = interventions.reduce((sum, i) => sum + i.expectedImpact, 0);

    return {
      targetNode: problemNodeId,
      interventions: interventions.sort((a, b) => (b.expectedImpact / b.cost) - (a.expectedImpact / a.cost)),
      totalExpectedReduction: Math.min(totalExpectedReduction, 0.95) // Cap at 95%
    };
  }

  // Simulate "what-if" scenarios
  simulateScenario(changes: { nodeId: string; newProbability: number }[]): { nodeId: string; oldProbability: number; newProbability: number }[] {
    const results = [];
    
    for (const change of changes) {
      const effects = this.predictEffects(change.nodeId);
      
      for (const effect of effects) {
        const causalEdge = this.graph.edges.find(e => e.from === change.nodeId && e.to === effect.id);
        if (causalEdge) {
          const probabilityChange = (change.newProbability - effect.probability) * causalEdge.strength;
          
          results.push({
            nodeId: effect.id,
            oldProbability: effect.probability,
            newProbability: Math.max(0, Math.min(1, effect.probability + probabilityChange))
          });
        }
      }
    }

    return results;
  }

  private createDefaultLogisticsGraph(): CausalGraph {
    const nodes: SymbolicNode[] = [
      { id: 'port_congestion', label: 'Port Congestion', description: 'High vessel traffic at port', type: 'condition', probability: 0.3 },
      { id: 'weather_delay', label: 'Weather Delay', description: 'Adverse weather conditions', type: 'condition', probability: 0.25 },
      { id: 'customs_delay', label: 'Customs Delay', description: 'Extended customs processing', type: 'condition', probability: 0.2 },
      { id: 'shipment_delay', label: 'Shipment Delay', description: 'Overall delivery delay', type: 'outcome', probability: 0.4 },
      { id: 'cost_increase', label: 'Cost Increase', description: 'Additional logistics costs', type: 'outcome', probability: 0.35 },
      { id: 'client_dissatisfaction', label: 'Client Dissatisfaction', description: 'Reduced client satisfaction', type: 'outcome', probability: 0.3 },
      { id: 'carrier_switch', label: 'Carrier Switch', description: 'Change to alternative carrier', type: 'action', probability: 0.1 },
      { id: 'route_optimization', label: 'Route Optimization', description: 'Alternative routing strategy', type: 'action', probability: 0.15 }
    ];

    const edges: CausalEdge[] = [
      { from: 'port_congestion', to: 'shipment_delay', causeType: 'mechanical', strength: 0.7, confidence: 0.9, delay: 24 },
      { from: 'weather_delay', to: 'shipment_delay', causeType: 'environmental', strength: 0.8, confidence: 0.95, delay: 12 },
      { from: 'customs_delay', to: 'shipment_delay', causeType: 'human', strength: 0.6, confidence: 0.8, delay: 6 },
      { from: 'shipment_delay', to: 'cost_increase', causeType: 'economic', strength: 0.5, confidence: 0.85, delay: 0 },
      { from: 'shipment_delay', to: 'client_dissatisfaction', causeType: 'human', strength: 0.9, confidence: 0.9, delay: 2 },
      { from: 'cost_increase', to: 'client_dissatisfaction', causeType: 'economic', strength: 0.4, confidence: 0.7, delay: 0 },
      { from: 'carrier_switch', to: 'cost_increase', causeType: 'economic', strength: 0.3, confidence: 0.6, delay: 1 },
      { from: 'route_optimization', to: 'shipment_delay', causeType: 'mechanical', strength: -0.4, confidence: 0.8, delay: 0 }
    ];

    return { nodes, edges };
  }

  private generateInterventionAction(nodeId: string): string {
    const actionMap: Record<string, string> = {
      port_congestion: 'Schedule shipments during off-peak hours',
      weather_delay: 'Monitor weather patterns and adjust routes',
      customs_delay: 'Pre-clear documentation and use trusted trader programs',
      carrier_reliability: 'Establish backup carrier agreements',
      route_capacity: 'Develop alternative route options'
    };

    return actionMap[nodeId] || 'Implement monitoring and contingency planning';
  }

  private estimateInterventionCost(nodeId: string): number {
    const costMap: Record<string, number> = {
      port_congestion: 500,
      weather_delay: 200,
      customs_delay: 300,
      carrier_reliability: 800,
      route_capacity: 1000
    };

    return costMap[nodeId] || 400;
  }

  getEngineStatus() {
    return {
      totalNodes: this.graph.nodes.length,
      totalEdges: this.graph.edges.length,
      engineType: 'Causal Graph Engine v1.0',
      status: 'ACTIVE'
    };
  }
}

export const causalGraphEngine = new CausalGraphEngine();
