
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
      return `Alright, let's talk speed! For maximum velocity, I'd definitely recommend ${fastest.carrier} operating through ${fastest.hub}. This route will get your shipment delivered in just ${fastest.transitTime} days, with an impressive ${fastest.reliability} percent reliability rating. Now, yes, it does cost ${fastest.cost} dollars, but when time is truly money, this route moves faster than morning coffee disappearing from the office kitchen! Compare that to the Dakar alternative, which takes ${routeDatabase[1].transitTime} days. That's ${routeDatabase[1].transitTime - fastest.transitTime} extra days of your cargo taking an extended vacation.`
    },

    optimization_cost: () => {
      const cheapest = routeDatabase.sort((a, b) => a.cost - b.cost)[0]
      return `I can see you're being budget-conscious, and that's smart business! ${cheapest.carrier} via ${cheapest.hub} is absolutely your wallet's best friend at just ${cheapest.cost} dollars. Now, it does take ${cheapest.transitTime} days to complete the journey, so it's not the absolute fastest option. But here's the beautiful part: you'll save ${routeDatabase[0].cost - cheapest.cost} dollars compared to the speed demon route. That's enough savings to treat your entire team to lunch for about a month! The reliability sits at a solid ${cheapest.reliability} percent, which honestly isn't bad at all for this price point.`
    },

    comparison: () => {
      const nairobi = routeDatabase.find((r) => r.hub === "Nairobi")!
      const dakar = routeDatabase.find((r) => r.hub === "Dakar")!
      return `Time for the ultimate showdown: Nairobi versus Dakar! Let me break this down for you. Nairobi takes the lead on speed, clocking in at ${nairobi.transitTime} days compared to Dakar's ${dakar.transitTime} days. Nairobi also wins the reliability contest with ${nairobi.reliability} percent versus Dakar's ${dakar.reliability} percent. However, Dakar fights back on the cost front, coming in at ${dakar.cost} dollars while Nairobi costs ${nairobi.cost} dollars. When we look at risk assessment, Nairobi is significantly safer with only ${nairobi.riskLevel} percent disruption risk, compared to Dakar's ${dakar.riskLevel} percent. The overall performance scores are Nairobi at ${nairobi.overallScore} and Dakar at ${dakar.overallScore}. The crown goes to Nairobi!`
    },

    metrics_time: () => {
      const avgTime = routeDatabase.reduce((sum, r) => sum + r.transitTime, 0) / routeDatabase.length
      return `Let me give you the complete transit time intelligence report. For your typical shipment, you should expect approximately ${Math.round(avgTime)} days on average. Now, the speed spectrum ranges from ${Math.min(...routeDatabase.map((r) => r.transitTime))} days if you're in a serious hurry and have deep pockets, all the way up to ${Math.max(...routeDatabase.map((r) => r.transitTime))} days if you're more patient than a meditation master. The good news is that current conditions are looking pretty stable across the board, with no major delays being reported from any of our key routes.`
    },

    metrics_risk: () => {
      const avgRisk = routeDatabase.reduce((sum, r) => sum + r.riskLevel, 0) / routeDatabase.length
      return `Time for a comprehensive risk assessment! Current disruption risk is averaging ${Math.round(avgRisk)} percent across all our major shipping routes. The Nairobi route is looking particularly solid right now, with only ${routeDatabase[0].riskLevel} percent risk, which is basically bulletproof in shipping terms. Some of the alternative routes are running slightly higher risk levels, but nothing too concerning. The weather has been surprisingly cooperative lately, there are no major port strikes on the horizon, and customs operations are moving smoother than usual. Honestly, it's a pretty good time to be shipping!`
    },

    explanation: () => {
      if (context.lastRecommendation) {
        const rec = context.lastRecommendation
        return `That's an excellent question! I recommended ${rec.carrier} because it achieved the highest overall score of ${rec.overallScore} in our comprehensive multi-criteria analysis. Let me walk you through the breakdown. Speed factor: ${rec.transitTime} days. Cost efficiency: ${rec.cost} dollars. Reliability rating: ${rec.reliability} percent. Risk assessment: ${rec.riskLevel} percent. The algorithm uses neutrosophic analytical hierarchy process, which is basically fancy mathematics that means we're being incredibly smart about trade-offs and decision making. It wasn't simply the fastest option or the cheapest option, but rather the best overall balance of all critical factors.`
      }
      return `I utilize a sophisticated decision engine that carefully considers multiple critical factors: transit time, cost effectiveness, reliability ratings, and comprehensive risk assessment. Each factor gets weighted based on typical logistics industry priorities, and then I calculate an overall performance score. Think of it as having a logistics expert's brain, but without the coffee addiction and with significantly better mathematical capabilities!`
    },

    guidance: () => {
      const best = routeDatabase.sort((a, b) => b.overallScore - a.overallScore)[0]
      setContext({ ...context, lastRecommendation: best })
      return `For your specific shipment requirements, I'm confidently recommending ${best.carrier} operating via ${best.hub}. Here's exactly why this choice is brilliant. Transit time: ${best.transitTime} days, which isn't the absolute fastest available, but it's definitely respectable. Cost: ${best.cost} dollars, which is very reasonable for this level of service quality. Reliability: ${best.reliability} percent, meaning your cargo won't be taking any unplanned detours or adventures. The overall performance score is ${best.overallScore}, and that's what we call hitting the sweet spot in logistics optimization! Would you like me to explain the alternative options in detail, or shall we dive deeper into any specific aspect of this recommendation?`
    },

    general: () => {
      const responses = [
        "I'm here and ready to tackle all your logistics challenges! Feel free to ask me about route optimization, cost analysis, timing estimates, or even why shipping containers sometimes seem to develop their own mysterious personalities!",
        "Ready to solve your most complex shipping puzzles! I can compare different routes, optimize for speed or cost, assess comprehensive risks, or just have an engaging conversation about the absolutely fascinating world of global logistics!",
        "Your dedicated logistics intelligence assistant at your complete service! Whether you need detailed route recommendations, thorough cost analysis, or you just want to understand why express shipping sometimes feels more like express waiting!",
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    },
  }

  return responses[intent as keyof typeof responses]?.() || responses.general()
}
