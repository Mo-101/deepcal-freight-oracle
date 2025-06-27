
import { SYMBOLIC_PATTERNS } from './symbolicPatterns'

interface RouteOption {
  id: string
  carrier: string
  route: string
  hub: string
  destination: string
  transitTime: number
  cost: number
  reliability: number
  riskLevel: number
  overallScore: number
}

export function generateTimeMetricsResponse(routeDatabase: RouteOption[]): string {
  const avgTime = routeDatabase.reduce((sum, r) => sum + r.transitTime, 0) / routeDatabase.length
  const minTime = Math.min(...routeDatabase.map((r) => r.transitTime))
  const maxTime = Math.max(...routeDatabase.map((r) => r.transitTime))
  
  return `⏰ **TEMPORAL INTELLIGENCE REPORT** ⏰

Greetings, seeker of chronological wisdom! The Time Oracles have consulted the Sacred Transit Matrices...

**The Temporal Landscape:**
- **Average Journey:** ${Math.round(avgTime)} days (${SYMBOLIC_PATTERNS.temporal(Math.round(avgTime))})
- **Lightning Route:** ${minTime} days (For when urgency demands sacrifice)
- **Scenic Route:** ${maxTime} days (For the patient philosopher)

**Seasonal Temporal Wisdom:**
Current conditions across our monitored corridors show remarkable stability. No major time warps detected in customs processing, no significant weather deities angry at logistics operations, and carrier performance remains within acceptable reality parameters.

**Strategic Insights:**
The ${minTime}-day route represents the absolute limit of what's physically possible without invoking quantum mechanics. The ${maxTime}-day option includes generous buffers for "African time" - that mystical dimension where meetings start when everyone arrives and shipments move at the pace of wisdom.

**Philosophical Note:** Time in logistics is like water in the desert - precious, often scarce, but absolutely essential for survival.

*DeepCAL's Time Blessing:* "He who masters time masters the universe... or at least gets his cargo delivered on schedule." ⌚🌍`
}

export function generateRiskMetricsResponse(routeDatabase: RouteOption[]): string {
  const avgRisk = routeDatabase.reduce((sum, r) => sum + r.riskLevel, 0) / routeDatabase.length
  const safeRoute = routeDatabase.sort((a, b) => a.riskLevel - b.riskLevel)[0]
  
  return `🛡️ **RISK ASSESSMENT CODEX** 🛡️

Welcome, guardian of cargo safety! The Risk Oracles have emerged from their chambers of probability...

**Current Threat Level:** ${Math.round(avgRisk)}% average disruption probability across all monitored corridors
*Translation:* ${avgRisk < 10 ? "Calmer than a meditation retreat" : avgRisk < 20 ? "Manageable turbulence expected" : "Adventure level elevated"}

**The Fortress Route:** ${safeRoute.carrier} maintains the lowest risk profile at only ${safeRoute.riskLevel}% disruption probability. This route is so secure, it's practically wrapped in bubble wrap and blessed by logistics deities.

**Intelligence Briefing:**
- Weather patterns: Surprisingly cooperative across the region
- Port operations: Running smoother than diplomatic negotiations
- Customs mood: Currently in good spirits (rare celestial alignment)
- Regional stability: Within normal parameters for controlled chaos

**Risk Philosophy:** In African logistics, a 5% risk means the gods are smiling, 15% means they're neutral, and anything above 25% means they're testing your patience and your insurance policy.

*Ancient Risk Proverb:* "The bravest logistics warrior is not one who fears no risk, but one who calculates it precisely and prepares accordingly." 🧮⚔️`
}
