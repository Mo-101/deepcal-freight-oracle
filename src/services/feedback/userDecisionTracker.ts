import { get, set } from 'idb-keyval';

export interface UserDecision {
  id: string;
  timestamp: Date;
  shipmentId: string;
  recommendedForwarder: string;
  selectedForwarder: string;
  reasoning?: string;
  context: {
    priorities: {
      cost: number;
      time: number;
      reliability: number;
      risk: number;
    };
    shipmentData: any;
  };
}

class UserDecisionTracker {
  private decisions: UserDecision[] = [];
  private storageKey = 'deepcal_user_decisions';

  async initialize() {
    try {
      const stored = await get(this.storageKey);
      if (stored) {
        this.decisions = stored.map((d: any) => ({
          ...d,
          timestamp: new Date(d.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load user decisions:', error);
    }
  }

  async trackDecision(decision: Omit<UserDecision, 'id' | 'timestamp'>) {
    const newDecision: UserDecision = {
      ...decision,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };

    this.decisions.push(newDecision);
    
    // Keep only last 1000 decisions
    if (this.decisions.length > 1000) {
      this.decisions = this.decisions.slice(-1000);
    }

    await this.persistDecisions();
    console.log('User decision tracked:', newDecision);
    return newDecision;
  }

  getDecisions(): UserDecision[] {
    return [...this.decisions];
  }

  getDecisionsByTimeRange(startDate: Date, endDate: Date): UserDecision[] {
    return this.decisions.filter(d => 
      d.timestamp >= startDate && d.timestamp <= endDate
    );
  }

  getDecisionsByForwarder(forwarderId: string): UserDecision[] {
    return this.decisions.filter(d => 
      d.recommendedForwarder === forwarderId || d.selectedForwarder === forwarderId
    );
  }

  getOverrideRate(): number {
    if (this.decisions.length === 0) return 0;
    const overrides = this.decisions.filter(d => 
      d.recommendedForwarder !== d.selectedForwarder
    );
    return overrides.length / this.decisions.length;
  }

  private async persistDecisions() {
    try {
      await set(this.storageKey, this.decisions);
    } catch (error) {
      console.error('Failed to persist decisions:', error);
    }
  }
}

export const userDecisionTracker = new UserDecisionTracker();
