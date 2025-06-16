import { DEEPCAL_WISDOM } from './wisdomDatabase'

// Enhanced symbolic reasoning patterns
export const SYMBOLIC_PATTERNS = {
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
export function generateNarrative(context: string, data: any): string {
  const wisdom = DEEPCAL_WISDOM.philosophical[Math.floor(Math.random() * DEEPCAL_WISDOM.philosophical.length)]
  return `📜 DeepCAL Scrolls whisper: "${wisdom}" Now, let me decode this logistics puzzle for you...`
}
