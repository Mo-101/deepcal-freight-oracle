
/**
 * Handles parsing of streaming responses from Groq API
 */
export class GroqStreamParser {
  /**
   * Parses streaming response chunks and calls onChunk for each content piece
   */
  static async parseStream(
    response: Response,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body available for streaming');

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
            try {
              const jsonStr = trimmed.slice(6);
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              // Skip invalid JSON lines - this is normal with streaming
              console.debug('Skipped invalid streaming JSON:', trimmed);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
