// Enhanced text preprocessing for efficient voice synthesis
export function preprocessText(text: string): string {
  return text
    // Remove markdown formatting
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/#{1,6}\s/g, '')
    
    // Remove all emojis and special characters that cause TTS issues
    .replace(/[🎯🚀📊⚔️🔥🌊⚖️👑🏆🌟🛡️🧠💫🔬🧙‍♂️☕🤖💰📜⏰🌍⌚✨⚡🎭🎨🔮]/g, '')
    
    // Remove section headers and formatting
    .replace(/\*\*.*?\*\*/g, '')
    .replace(/#{1,6}\s.*?\n/g, '')
    .replace(/- \*\*.*?\*\*/g, '')
    .replace(/\n\n+/g, '. ')
    .replace(/\n/g, '. ')
    
    // Remove bullet points and lists
    .replace(/^[\s]*[-•*]\s/gm, '')
    .replace(/^\d+\.\s/gm, '')
    
    // Simplify for natural speech
    .replace(/DeepCAL\+\+/g, 'DeepCAL')
    .replace(/TOPSIS/g, 'analysis')
    .replace(/neutrosophic/g, 'advanced')
    
    // Keep more sentences for fuller responses (increased from 2 to 4)
    .split(/[.!?]+/)
    .slice(0, 4)
    .join('. ')
    
    // Clean up extra whitespace
    .replace(/\s+/g, ' ')
    .trim()
    
    // Add natural ending if truncated
    + (text.length > 300 ? '.' : '');
}
