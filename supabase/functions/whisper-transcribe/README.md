# Whisper Transcribe Edge Function

This Supabase Edge Function transcribes audio files using OpenAI's Whisper API.

## Key Fix for React Native

**The Problem:**
React Native uploads files as Blob-like objects, and `instanceof File` checks don't work reliably in Supabase Edge Runtime. This caused the function to return 400 errors, which React Native interpreted as "Network request failed".

**The Solution:**
We removed the `instanceof File` check and only validate that `audioFile` exists:

```typescript
// ✅ CORRECT - Works with React Native
if (!audioFile) {
  return new Response(JSON.stringify({ error: 'No audio file provided' }), {
    status: 400,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// ❌ WRONG - Breaks React Native uploads
if (!audioFile || !(audioFile instanceof File)) {
  // This will ALWAYS fail for React Native
}
```

## Prerequisites

1. **OpenAI API Key**: Must be set in Supabase project environment variables
2. **Supabase CLI**: Install to deploy functions

## Deployment Instructions

### Option 1: Using Supabase CLI (Recommended)

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref njdztbggnwowqbtajsgh
   ```

4. **Set your OpenAI API Key** (if not already set):
   ```bash
   supabase secrets set OPENAI_API_KEY=your-openai-api-key-here
   ```

5. **Deploy the function**:
   ```bash
   supabase functions deploy whisper-transcribe
   ```

### Option 2: Using Supabase Dashboard

1. Go to https://supabase.com/dashboard/project/njdztbggnwowqbtajsgh/functions
2. Click on "whisper-transcribe" function (or create new)
3. Copy the contents of `index.ts` from this folder
4. Paste into the editor
5. Click "Deploy"
6. Make sure `OPENAI_API_KEY` is set in Project Settings > Edge Functions > Secrets

## Testing

After deployment, test from your React Native app:

1. Start Expo: `npx expo start`
2. Open the app in Expo Go
3. Navigate to Vocabulary screen
4. Tap microphone and speak a Spanish phrase
5. The transcription should appear without "Network request failed" errors

## API Response Format

**Success Response** (200):
```json
{
  "text": "transcribed spanish text"
}
```

**Error Responses**:
```json
// 400 - No file provided
{ "error": "No audio file provided" }

// 500 - OpenAI API error
{ "error": "Whisper API request failed", "details": "..." }

// 500 - Function error
{ "error": "error message" }
```

## Environment Variables

Required in Supabase Project Settings > Edge Functions > Secrets:

- `OPENAI_API_KEY`: Your OpenAI API key from https://platform.openai.com/api-keys

## CORS Configuration

The function includes CORS headers to allow requests from your React Native app:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
```

## Troubleshooting

**"Network request failed"**:
- ✅ Fixed by removing `instanceof File` check
- Ensure function is deployed
- Check Supabase logs: Dashboard > Edge Functions > Logs

**"OPENAI_API_KEY not configured"**:
- Set secret: `supabase secrets set OPENAI_API_KEY=your-key`
- Or via Dashboard: Project Settings > Edge Functions > Secrets

**"No audio file provided"**:
- Check React Native FormData format
- Ensure file has `uri`, `type`, and `name` properties

## Learn More

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [OpenAI Whisper API Docs](https://platform.openai.com/docs/guides/speech-to-text)
