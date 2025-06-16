
/**
 * Intelligent text chunking that preserves narrative flow
 */
export function chunkTextIntelligently(text: string, maxLength: number): string[] {
  if (text.length <= maxLength) return [text]
  
  const chunks: string[] = []
  let currentChunk = ""
  
  // Split by sentences to maintain natural flow
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length <= maxLength) {
      currentChunk += sentence
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim())
        currentChunk = sentence
      } else {
        // Sentence is too long, split by words
        const words = sentence.split(' ')
        let wordChunk = ""
        for (const word of words) {
          if (wordChunk.length + word.length + 1 <= maxLength) {
            wordChunk += (wordChunk ? ' ' : '') + word
          } else {
            if (wordChunk) chunks.push(wordChunk)
            wordChunk = word
          }
        }
        if (wordChunk) currentChunk = wordChunk
      }
    }
  }
  
  if (currentChunk) chunks.push(currentChunk.trim())
  return chunks
}
