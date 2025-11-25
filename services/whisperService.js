// OpenAI API configuration
// IMPORTANT: Add your API key in a .env file
const OPENAI_API_KEY = 'your-openai-api-key-here'; // Replace with your actual API key
const WHISPER_API_URL = 'https://api.openai.com/v1/audio/transcriptions';

/**
 * Transcribe audio using OpenAI Whisper API
 * @param {string} audioUri - URI of the recorded audio file
 * @returns {Promise<string>} - Transcribed text
 */
export async function transcribeAudio(audioUri) {
  try {
    console.log('Transcribing audio from:', audioUri);

    // Determine file type from URI
    let fileType = 'audio/m4a'; // default for iOS
    let fileName = 'recording.m4a';

    if (audioUri.includes('.wav')) {
      fileType = 'audio/wav';
      fileName = 'recording.wav';
    } else if (audioUri.includes('.mp3')) {
      fileType = 'audio/mp3';
      fileName = 'recording.mp3';
    } else if (audioUri.includes('.mp4')) {
      fileType = 'audio/mp4';
      fileName = 'recording.mp4';
    }

    // Create FormData for file upload (React Native compatible)
    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      type: fileType,
      name: fileName
    });
    formData.append('model', 'whisper-1');
    formData.append('language', 'es'); // Spanish
    formData.append('response_format', 'text');

    // Make direct API call using fetch
    const response = await fetch(WHISPER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Whisper API Error Response:', errorData);
      throw new Error(`Whisper API returned ${response.status}: ${errorData}`);
    }

    const transcription = await response.text();
    console.log('Transcription result:', transcription);

    return transcription.trim();
  } catch (error) {
    console.error('Whisper API Error:', error);
    throw new Error('Failed to transcribe audio: ' + error.message);
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
