import OpenAI from 'openai';

// Initialize OpenAI client
// In production, store this in environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here',
  dangerouslyAllowBrowser: true // Note: In production, call API from backend
});

/**
 * Transcribe audio using OpenAI Whisper API
 * @param {string} audioUri - URI of the recorded audio file
 * @returns {Promise<string>} - Transcribed text
 */
export async function transcribeAudio(audioUri) {
  try {
    // Convert audio URI to File/Blob for upload
    const response = await fetch(audioUri);
    const blob = await response.blob();
    const file = new File([blob], 'recording.wav', { type: 'audio/wav' });

    // Call Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'es', // Spanish
      response_format: 'text'
    });

    return transcription.trim();
  } catch (error) {
    console.error('Whisper API Error:', error);
    throw new Error('Failed to transcribe audio');
  }
}

/**
 * Compare transcribed text with expected text
 * @param {string} transcribed - Text from Whisper
 * @param {string} expected - Expected Spanish text
 * @returns {Object} - Result with match status and similarity score
 */
export function compareTexts(transcribed, expected) {
  // Normalize texts: lowercase, remove punctuation, trim
  const normalize = (text) =>
    text.toLowerCase()
      .replace(/[¿?¡!.,;:]/g, '')
      .trim();

  const normalizedTranscribed = normalize(transcribed);
  const normalizedExpected = normalize(expected);

  // Exact match
  if (normalizedTranscribed === normalizedExpected) {
    return {
      isCorrect: true,
      score: 100,
      feedback: 'Perfect!',
      transcribed: transcribed
    };
  }

  // Calculate similarity using Levenshtein distance
  const similarity = calculateSimilarity(normalizedTranscribed, normalizedExpected);

  // Accept if similarity is above 80%
  if (similarity >= 80) {
    return {
      isCorrect: true,
      score: similarity,
      feedback: 'Great job!',
      transcribed: transcribed
    };
  } else if (similarity >= 60) {
    return {
      isCorrect: false,
      score: similarity,
      feedback: 'Close, but try again!',
      transcribed: transcribed
    };
  } else {
    return {
      isCorrect: false,
      score: similarity,
      feedback: 'Try again!',
      transcribed: transcribed
    };
  }
}

/**
 * Calculate similarity percentage between two strings
 * Using Levenshtein distance algorithm
 */
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) {
    return 100;
  }

  const distance = levenshteinDistance(longer, shorter);
  return Math.round(((longer.length - distance) / longer.length) * 100);
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}
