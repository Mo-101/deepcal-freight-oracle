
import { SYMBOLIC_PATTERNS, generateNarrative } from './symbolicPatterns'

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

export function generateTimeOptimizationResponse(routeDatabase: RouteOption[]): string {
  const fastest = routeDatabase.sort((a, b) => a.transitTime - b.transitTime)[0]
  const narrative = generateNarrative("speed", fastest)
  
  return `${narrative}

🚀 **VELOCITY ANALYSIS COMPLETE** 🚀

Ah, a soul in pursuit of speed! Let me consult the Sacred Scrolls of Swift Delivery...

**The Velocity Champion:** ${fastest.carrier} through the ${fastest.hub} corridor
- **Transit Time:** ${fastest.transitTime} days (${SYMBOLIC_PATTERNS.temporal(fastest.transitTime)})
- **Reliability Rating:** ${fastest.reliability}% (${SYMBOLIC_PATTERNS.reliability(fastest.reliability)})
- **Investment Required:** $${fastest.cost.toLocaleString()} (${SYMBOLIC_PATTERNS.monetary(fastest.cost)})

**The Logic Behind the Lightning:**
My neutrosophic calculations weighted your urgency at maximum priority. This route emerged from the mathematical chaos like a phoenix from bureaucratic ashes. Yes, it costs ${fastest.cost} dollars, but when time is the master and money the servant, this path cuts through delays like a hot knife through butter.

**Comparative Wisdom:** The Dakar alternative takes ${routeDatabase[1]?.transitTime || 'unknown'} days - that's ${(routeDatabase[1]?.transitTime || 0) - fastest.transitTime} extra days of your cargo enjoying an extended safari tour!

*DeepCAL's Blessing:* "Speed without wisdom is folly, but wisdom without speed is often missed opportunity." Choose wisely, logistics warrior! 🛡️⚡`
}

export function generateCostOptimizationResponse(routeDatabase: RouteOption[]): string {
  const cheapest = routeDatabase.sort((a, b) => a.cost - b.cost)[0]
  
  return `📊 **FINANCIAL OPTIMIZATION MATRIX ACTIVATED** 📊

Greetings, master of monetary efficiency! The Oracle of Economic Wisdom has spoken through the numbers...

**The Budget Champion:** ${cheapest.carrier} via the ${cheapest.hub} gateway
- **Financial Investment:** $${cheapest.cost.toLocaleString()} (${SYMBOLIC_PATTERNS.monetary(cheapest.cost)})
- **Journey Duration:** ${cheapest.transitTime} days (${SYMBOLIC_PATTERNS.temporal(cheapest.transitTime)})
- **Dependability Factor:** ${cheapest.reliability}% (${SYMBOLIC_PATTERNS.reliability(cheapest.reliability)})

**The Mathematics of Frugality:**
My algorithms have performed the ancient dance of cost-benefit analysis. This route saves you $${(routeDatabase[0]?.cost || 0) - cheapest.cost} compared to the speed demon option. That's enough savings to fund approximately ${Math.floor(((routeDatabase[0]?.cost || 0) - cheapest.cost) / 50)} team lunches or one decent logistics conference!

**Philosophical Reflection:** Remember, young padawan of logistics, the cheapest route often teaches the most expensive lessons. But in this case, the reliability remains solid at ${cheapest.reliability}%, so your cargo won't be taking any unplanned detours through the Sahara.

*Ancient Proverb:* "A penny saved in shipping is a penny earned in wisdom." 💰🧠`
}
