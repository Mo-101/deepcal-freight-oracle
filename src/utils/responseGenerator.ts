
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

export function generateResponse(
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
      return `🚀 For maximum speed, I'd go with ${fastest.carrier} via ${fastest.hub}! It'll get there in just ${fastest.transitTime} days with ${fastest.reliability}% reliability. Sure, it costs $${fastest.cost}, but time is money, and this route moves faster than gossip in a small town! The alternative via Dakar takes ${routeDatabase[1].transitTime} days - that's ${routeDatabase[1].transitTime - fastest.transitTime} extra days of your cargo playing tourist.`
    },

    optimization_cost: () => {
      const cheapest = routeDatabase.sort((a, b) => a.cost - b.cost)[0]
      return `💰 Budget-conscious, I see! ${cheapest.carrier} via ${cheapest.hub} is your wallet's best friend at just $${cheapest.cost}. Yes, it takes ${cheapest.transitTime} days (not the fastest), but you'll save $${routeDatabase[0].cost - cheapest.cost} compared to the speed demon option. That's enough savings to buy everyone on your team lunch... for a month! Reliability sits at ${cheapest.reliability}%, which isn't bad for the price.`
    },

    comparison: () => {
      const nairobi = routeDatabase.find((r) => r.hub === "Nairobi")!
      const dakar = routeDatabase.find((r) => r.hub === "Dakar")!
      return `🥊 Nairobi vs Dakar showdown! Here's the tea: Nairobi wins on speed (${nairobi.transitTime} vs ${dakar.transitTime} days) and reliability (${nairobi.reliability}% vs ${dakar.reliability}%). But Dakar fights back on cost ($${dakar.cost} vs $${nairobi.cost}). Risk-wise, Nairobi is safer (${nairobi.riskLevel}% vs ${dakar.riskLevel}% disruption risk). Overall score: Nairobi ${nairobi.overallScore} vs Dakar ${dakar.overallScore}. Nairobi takes the crown! 👑`
    },

    metrics_time: () => {
      const avgTime = routeDatabase.reduce((sum, r) => sum + r.transitTime, 0) / routeDatabase.length
      return `⏰ Transit time intel coming right up! For your typical shipment, expect ${Math.round(avgTime)} days on average. The speed range goes from ${Math.min(...routeDatabase.map((r) => r.transitTime))} days (if you're in a hurry and have deep pockets) to ${Math.max(...routeDatabase.map((r) => r.transitTime))} days (if you're more patient than a saint). Current conditions are pretty stable - no major delays reported!`
    },

    metrics_risk: () => {
      const avgRisk = routeDatabase.reduce((sum, r) => sum + r.riskLevel, 0) / routeDatabase.length
      return `🛡️ Risk assessment time! Current disruption risk averages ${Math.round(avgRisk)}% across major routes. Nairobi route is looking solid at ${routeDatabase[0].riskLevel}% risk (basically bulletproof), while some alternatives run higher. Weather's been cooperative, no major port strikes, and customs are moving smoother than usual. It's a good time to ship!`
    },

    explanation: () => {
      if (context.lastRecommendation) {
        const rec = context.lastRecommendation
        return `🤔 Great question! I recommended ${rec.carrier} because it scored highest (${rec.overallScore}) on our multi-criteria analysis. Here's the breakdown: Speed factor (${rec.transitTime} days), Cost efficiency ($${rec.cost}), Reliability (${rec.reliability}%), and Risk level (${rec.riskLevel}%). The algorithm weighs these using neutrosophic AHP - fancy math that basically means "let's be smart about trade-offs." It wasn't just the fastest or cheapest, but the best overall balance!`
      }
      return `🎯 I use a sophisticated decision engine that considers multiple factors: transit time, cost, reliability, and risk. Each gets weighted based on typical logistics priorities, then I calculate an overall score. It's like having a logistics expert's brain, but without the coffee addiction and with better math skills!`
    },

    guidance: () => {
      const best = routeDatabase.sort((a, b) => b.overallScore - a.overallScore)[0]
      setContext({ ...context, lastRecommendation: best })
      return `🎯 For your shipment, I'm recommending ${best.carrier} via ${best.hub}! Here's why it's brilliant: ${best.transitTime} days transit (not the absolute fastest, but respectable), $${best.cost} cost (reasonable for the service level), and ${best.reliability}% reliability (your cargo won't go on an unplanned adventure). Overall score: ${best.overallScore} - that's what we call the sweet spot! Want me to explain the alternatives or dive deeper into any aspect?`
    },

    general: () => {
      const funnyResponses = [
        "🤖 I'm here to help with all your logistics needs! Ask me about routes, costs, timing, or why shipping containers sometimes seem to have a mind of their own!",
        "📦 Ready to solve your shipping puzzles! I can compare routes, optimize for speed or cost, assess risks, or just chat about the fascinating world of global logistics!",
        "🌍 Your friendly neighborhood logistics AI at your service! Whether you need route recommendations, cost analysis, or just want to know why 'express shipping' sometimes feels like 'express waiting'!",
      ]
      return funnyResponses[Math.floor(Math.random() * funnyResponses.length)]
    },
  }

  return responses[intent as keyof typeof responses]?.() || responses.general()
}
