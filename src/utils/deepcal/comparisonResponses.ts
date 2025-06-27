
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

export function generateComparisonResponse(routeDatabase: RouteOption[]): string {
  const nairobi = routeDatabase.find((r) => r.hub === "Nairobi") || routeDatabase[0]
  const dakar = routeDatabase.find((r) => r.hub === "Dakar") || routeDatabase[1]
  
  return `⚔️ **THE GREAT HUB BATTLE: EAST VERSUS WEST** ⚔️

Behold! A clash of titans in the grand arena of African logistics! Let the comparative analysis begin...

**🔥 IN THE EASTERN CORNER: NAIROBI 🔥**
- Speed: ${nairobi.transitTime} days (The Cheetah of Corridors)
- Cost: $${nairobi.cost.toLocaleString()} (Premium for Performance)
- Reliability: ${nairobi.reliability}% (${SYMBOLIC_PATTERNS.reliability(nairobi.reliability)})
- Risk Factor: ${nairobi.riskLevel}% (Safer than a mother's embrace)

**🌊 IN THE WESTERN CORNER: DAKAR 🌊**
- Speed: ${dakar.transitTime} days (The Steady Voyager)
- Cost: $${dakar.cost.toLocaleString()} (Budget-Friendly Warrior)
- Reliability: ${dakar.reliability}% (${SYMBOLIC_PATTERNS.reliability(dakar.reliability)})
- Risk Factor: ${dakar.riskLevel}% (Slightly more adventurous)

**⚖️ THE ORACLE'S VERDICT:**
Nairobi dominates in the trinity of speed, reliability, and safety. It's faster by ${dakar.transitTime - nairobi.transitTime} days, more reliable by ${nairobi.reliability - dakar.reliability} percentage points, and carries ${dakar.riskLevel - nairobi.riskLevel}% less risk of disruption.

However, Dakar fights valiantly with its economic advantage, costing $${nairobi.cost - dakar.cost} less. The overall performance scores tell the tale: Nairobi ${nairobi.overallScore} vs Dakar ${dakar.overallScore}.

**Final Decree:** Nairobi claims the crown! 👑 But if your budget whispers louder than your urgency, Dakar remains a noble alternative.

*Logistics Wisdom:* "In the battle of hubs, context is king, but Nairobi often wears the crown." 🏆`
}
