
// Enhanced text preprocessing for efficient voice synthesis with male voice optimization
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
    
    // Simplify technical terms for natural male speech
    .replace(/DeepCAL\+\+/g, 'DeepCAL')
    .replace(/TOPSIS/g, 'analysis')
    .replace(/neutrosophic/g, 'advanced')
    .replace(/AHP/g, 'analytical hierarchy process')
    
    // Enhanced sentence preservation for complete text synthesis
    .split(/[.!?]+/)
    .filter(sentence => sentence.trim().length > 5) // Remove very short fragments
    .slice(0, 6) // Increased from 4 to 6 sentences for fuller responses
    .join('. ')
    
    // Clean up extra whitespace and ensure proper sentence endings
    .replace(/\s+/g, ' ')
    .trim()
    
    // Add natural ending punctuation for better male voice delivery
    + (text.length > 200 ? '.' : '');
}
