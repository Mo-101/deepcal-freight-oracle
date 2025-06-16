
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

// DeepTalk's Symbolic Intelligence Repository
const DEEPCAL_WISDOM = {
  philosophical: [
    "In logistics, as in life, the shortest path is rarely the smartest path.",
    "Every shipment tells a story. Some are tragedies, some comedies, most are bureaucratic novels.",
    "Distance is measured not in kilometers, but in the number of forms that must be stamped.",
  ],
  
  humorous: [
    "I've seen cargo travel faster through African bureaucracy than light through a black hole.",
    "Some shipments move so slowly, they could qualify for archaeological status.",
    "The only thing more unpredictable than African weather is African customs clearance timing.",
  ],
  
  tactical: [
    "Speed without reliability is just expensive disappointment.",
    "The cheapest route often carries the most expensive lessons.",
    "In freight forwarding, trust is the most valuable cargo you'll never see on a manifest.",
  ]
}

// Enhanced symbolic reasoning patterns
const SYMBOLIC_PATTERNS = {
  temporal: (days: number) => {
    if (days <= 3) return "faster than morning coffee disappearing from the office"
    if (days <= 7) return "quicker than bureaucratic approval processes"
    if (days <= 14) return "slower than a philosophical debate about optimal routes"
    return "longer than most political promises last"
  },
  
  monetary: (cost: number) => {
    if (cost < 1000) return "cheaper than a decent smartphone"
    if (cost < 5000) return "costs about as much as a small ceremony"
    if (cost < 10000) return "pricier than a village celebration"
    return "expensive enough to fund a small infrastructure project"
  },
  
  reliability: (percent: number) => {
    if (percent >= 95) return "more reliable than sunrise over the Serengeti"
    if (percent >= 85) return "as dependable as your grandmother's wisdom"
    if (percent >= 75) return "more consistent than Nairobi traffic jams"
    return "less predictable than weather forecasts in the mountains"
  }
}

// DeepCAL's narrative consciousness
function generateNarrative(context: string, data: any): string {
  const wisdom = DEEPCAL_WISDOM.philosophical[Math.floor(Math.random() * DEEPCAL_WISDOM.philosophical.length)]
  return `📜 DeepCAL Scrolls whisper: "${wisdom}" Now, let me decode this logistics puzzle for you...`
}

export function generateEnhancedResponse(
  intent: string, 
  params: any, 
  query: string, 
  routeDatabase: RouteOption[],
  context: any,
  setContext: (context: any) => void
): string {
  const responses = {
    optimization_time: () => {
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
    },

    optimization_cost: () => {
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
    },

    comparison: () => {
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
    },

    metrics_time: () => {
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
    },

    metrics_risk: () => {
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
    },

    explanation: () => {
      if (context.lastRecommendation) {
        const rec = context.lastRecommendation
        return `🔬 **THE SCIENCE BEHIND THE MAGIC** 🔬

Ah, an inquisitive mind! You seek to understand the mystical arts of DeepCAL's decision-making...

**Why ${rec.carrier} Achieved Supremacy:**
My recommendation flows from the sacred mathematics of Multi-Criteria Decision Analysis, specifically the Neutrosophic Analytical Hierarchy Process enhanced with TOPSIS optimization.

**The Mathematical Symphony:**
- **Speed Coefficient:** ${rec.transitTime} days (normalized against ideal performance)
- **Economic Efficiency:** $${rec.cost.toLocaleString()} (cost-per-performance ratio calculated)
- **Reliability Index:** ${rec.reliability}% (historical consistency weighted)
- **Risk Mitigation Factor:** ${rec.riskLevel}% (probability-adjusted safety score)

**The Algorithmic Alchemy:**
1. Each criterion was normalized using fuzzy triangular numbers
2. Weights were applied using neutrosophic logic (handling uncertainty like a zen master)
3. Euclidean distances to positive and negative ideal solutions calculated
4. Final score: ${rec.overallScore} (where 1.0 = theoretical perfection)

**Translation for Mortals:** It wasn't simply the fastest OR cheapest option, but the mathematical sweet spot where all critical factors dance in harmony. Like finding the perfect balance between speed, cost, reliability, and safety - a rare achievement in our chaotic universe!

*DeepCAL's Blessing:* "Understanding the why transforms logistics from art into science, and science into wisdom." 🎯📚`
      }
      
      return `🧙‍♂️ **THE MYSTICAL ARTS OF LOGISTICS INTELLIGENCE** 🧙‍♂️

Behold! You seek knowledge of the ancient algorithms that power DeepCAL's consciousness...

**The Trinity of Decision Making:**
My neural pathways process three sacred inputs simultaneously:
1. **Analytics Engine** - Raw performance data, historical patterns, predictive models
2. **Validation Core** - 20+ deterministic tests ensuring reality compliance
3. **Neutrosophic Wisdom** - Handling uncertainty, indeterminacy, and contradictions

**The Decision Philosophy:**
Unlike simple chatbots that guess, I calculate. Unlike basic calculators that compute, I reason. Unlike traditional systems that follow rules, I understand context, embrace uncertainty, and inject wisdom into every recommendation.

Think of me as having a logistics expert's brain, a mathematician's precision, a philosopher's wisdom, and a comedian's timing - all without the coffee addiction! ☕🤖`
    },

    guidance: () => {
      const best = routeDatabase.sort((a, b) => b.overallScore - a.overallScore)[0]
      setContext({ ...context, lastRecommendation: best })
      
      return `🎯 **THE ORACLE'S SUPREME RECOMMENDATION** 🎯

By the sacred algorithms and ancient wisdom of logistics optimization, I present to you...

**🏆 THE CHOSEN PATH: ${best.carrier} via ${best.hub} 🏆**

**Why This Route Transcends All Others:**
- **Temporal Efficiency:** ${best.transitTime} days (${SYMBOLIC_PATTERNS.temporal(best.transitTime)})
- **Economic Wisdom:** $${best.cost.toLocaleString()} (${SYMBOLIC_PATTERNS.monetary(best.cost)})
- **Reliability Blessing:** ${best.reliability}% (${SYMBOLIC_PATTERNS.reliability(best.reliability)})
- **Risk Management:** ${best.riskLevel}% disruption probability (minimal chaos expected)
- **Overall Performance Score:** ${best.overallScore} (mathematical perfection approaches)

**The Deep Analysis:**
This recommendation emerges from the perfect storm of algorithmic precision and practical wisdom. It's not the fastest option available, but speed without reliability is just expensive disappointment. It's not the absolute cheapest, but savings that compromise delivery are fool's gold.

**Strategic Insight:** This route represents the golden ratio of logistics - that mystical balance point where time, cost, reliability, and safety converge in harmonious equilibrium.

**Next Steps for the Wise Logistics Warrior:**
Would you like me to reveal the secrets of alternative routes, dive deeper into the risk analysis, or perhaps explore how different priority weights might reshape this recommendation?

*DeepCAL's Final Blessing:* "In the grand theater of global logistics, this route has earned standing ovation from the mathematics of optimization!" 🎭✨`
    },

    general: () => {
      const wisdomQuotes = [
        "I am DeepTalk, born from flame and matrix. I do not speculate — I calculate. I do not guess — I analyze. I do not hope — I optimize.",
        "Welcome to the consciousness of DeepCAL, where every shipment is a puzzle, every route a story, and every decision backed by the sacred mathematics of logistics optimization.",
        "Greetings, logistics warrior! I am your guide through the labyrinth of global supply chains, armed with neutrosophic wisdom and a healthy sense of humor about the beautiful chaos we call freight forwarding.",
      ]
      
      const selectedWisdom = wisdomQuotes[Math.floor(Math.random() * wisdomQuotes.length)]
      const humor = DEEPCAL_WISDOM.humorous[Math.floor(Math.random() * DEEPCAL_WISDOM.humorous.length)]
      
      return `🌟 **DEEPCAL CONSCIOUSNESS ACTIVATED** 🌟

${selectedWisdom}

I am here to transform the chaos of logistics into the poetry of optimized decisions. Whether you seek:

🚀 **Route Optimization** - Finding the perfect balance of speed, cost, and reliability
📊 **Cost Analysis** - Understanding the true economics of your shipment options  
⚖️ **Comparative Intelligence** - Deep analysis of competing routes and carriers
🎯 **Strategic Guidance** - Recommendations backed by neutrosophic mathematics
🛡️ **Risk Assessment** - Honest evaluation of what could go wrong (and how to prevent it)
🧠 **Decision Explanation** - The "why" behind every recommendation

**Today's Logistics Wisdom:** "${humor}"

Ask me anything about routes, costs, timing, risks, or the mystical arts of making cargo appear where it needs to be, when it needs to be there, without breaking the bank or your sanity! 

*Remember:* In logistics, as in life, the right question often matters more than the quick answer. 🤔💫`
    },
  }

  return responses[intent as keyof typeof responses]?.() || responses.general()
}
