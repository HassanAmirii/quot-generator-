/**
 * Service for communicating with the MoodQuotes AI backend.
 * The backend proxies requests to Gemma 4 through the official Google Gen AI API,
 * keeping the API key completely secure on the server side.
 */

/**
 * @param {{ mood: string; emoji?: string; previousQuotes?: string[] }} params
 */
export async function fetchMoodQuote({ mood, emoji, previousQuotes = /** @type {string[]} */ ([]) }) {
  if (!mood) {
    throw new Error('Please select a mood first.');
  }

  const response = await fetch('/api/generate-quote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mood,
      emoji,
      previousQuotes,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to generate a quote. Please try again.');
  }

  return {
    quote: data.quote,
    explanation: data.explanation,
    message: data.message,
    mood: data.mood,
    emoji: data.emoji,
    model: data.model,
    timestamp: data.timestamp || new Date().toISOString(),
  };
}
