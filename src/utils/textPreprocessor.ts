
/**
 * Enhanced text preprocessing for DeepCAL's sophisticated voice
 */
export function preprocessText(text: string): string {
  return text
    // Remove markdown formatting but preserve structure
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/###?\s/g, "")
    .replace(/#{1,6}\s/g, "")
    
    // Clean emojis and symbols for cleaner speech
    .replace(/[🚚🚀💰🥊⏰🛡️🤔🎯📦🌍🤖👑🔥⚔️🌊⚖️👑🏆📜📊⏰🛡️🔬🧙‍♂️🎯🌟🎭✨💫🧠]/gu, "")
    .replace(/[🔊🧬🎤💬🧭⚙️🔐🛠️🔥]/gu, "")
    
    // Convert currency and numbers to natural speech
    .replace(/\$(\d{1,3}(?:,\d{3})*)/g, "$1 dollars")
    .replace(/(\d+)%/g, "$1 percent")
    .replace(/(\d+)kg/g, "$1 kilograms")
    .replace(/(\d+)\s*days?/g, "$1 days")
    
    // Expand abbreviations for clarity
    .replace(/\bDHL\b/g, "D.H.L.")
    .replace(/\bFedEx\b/g, "Fed Ex")
    .replace(/\bUPS\b/g, "U.P.S.")
    .replace(/\bTOPSIS\b/g, "TOP-SIS")
    .replace(/\bAHP\b/g, "A.H.P.")
    .replace(/\bDeepCAL\b/g, "Deep-CAL")
    
    // Add natural pauses for dramatic effect and clarity
    .replace(/\./g, ". ")
    .replace(/!/g, "! ")
    .replace(/\?/g, "? ")
    .replace(/:/g, ": ")
    .replace(/;/g, "; ")
    
    // Add pauses after section headers
    .replace(/\*\*([^*]+)\*\*/g, "$1. ")
    
    // Handle bullet points and lists
    .replace(/[-•]\s*/g, "")
    .replace(/\n\s*\n/g, ". ")
    .replace(/\n/g, " ")
    
    // Clean up extra spaces and formatting
    .replace(/\s+/g, " ")
    .replace(/\s*\.\s*\./g, ".")
    .trim()
}
