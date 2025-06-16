
import { DEEPCAL_WISDOM, WISDOM_QUOTES } from './wisdomDatabase'

export function generateGeneralResponse(): string {
  const selectedWisdom = WISDOM_QUOTES[Math.floor(Math.random() * WISDOM_QUOTES.length)]
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
}
