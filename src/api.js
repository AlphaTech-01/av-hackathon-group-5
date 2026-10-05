/**
 * API client using native fetch to communicate with the Flask backend.
 */

/**
 * Fetch the complete precalculated financial health analysis.
 */
export async function fetchAnalysis() {
  const response = await fetch('/api/analysis');
  if (!response.ok) {
    throw new Error(
      `Failed to load financial analysis (${response.status} ${response.statusText}). ` +
      'Ensure the backend is running at http://localhost:5000 (run "python app.py").'
    );
  }
  return response.json();
}

/**
 * Fetch the AI narrative summary (called asynchronously after main dashboard load).
 */
export async function fetchAiSummary() {
  const response = await fetch('/api/ai-summary');
  if (!response.ok) {
    throw new Error(
      `Failed to load AI summary (${response.status} ${response.statusText}).`
    );
  }
  return response.json();
}
