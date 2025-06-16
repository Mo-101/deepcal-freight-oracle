
// Text preprocessing utilities for enhanced speech
export function preprocessText(text: string): string {
  return text
    // Remove markdown formatting
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/#{1,6}\s/g, '')
    
    // Remove emojis and special characters that might cause TTS issues
    .replace(/[🎯🚀📊⚔️🔥🌊⚖️👑🏆🌟🛡️🧠💫🔬🧙‍♂️☕🤖💰📜⏰🌍⌚]/g, '')
    
    // Clean up extra whitespace
    .replace(/\s+/g, ' ')
    .trim()
}
