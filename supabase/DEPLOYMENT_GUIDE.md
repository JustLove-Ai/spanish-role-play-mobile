# Supabase Edge Function Deployment Guide

## Quick Deploy (Easiest Method)

The easiest way to deploy is using the **Supabase Dashboard**:

### 1. Go to Supabase Dashboard
Visit: https://supabase.com/dashboard/project/njdztbggnwowqbtajsgh/functions

### 2. Select or Create Function
- If "whisper-transcribe" exists, click it
- If not, click "Create a new function" and name it "whisper-transcribe"

### 3. Copy & Paste the Code
Copy the contents of `supabase/functions/whisper-transcribe/index.ts` and paste it into the editor.

### 4. Set Environment Variable
- Go to Project Settings > Edge Functions > Secrets
- Add secret: `OPENAI_API_KEY` = your OpenAI API key
- Get your key from: https://platform.openai.com/api-keys

### 5. Deploy
Click "Deploy" button

### 6. Test
Open your React Native app and try the speech recognition feature!

---

## Alternative: Using Supabase CLI

If you prefer command-line deployment:

### Windows Installation

**Option A: Scoop** (Recommended)
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Option B: Chocolatey**
```bash
choco install supabase
```

**Option C: NPX** (No installation needed)
```bash
npx supabase login
npx supabase link --project-ref njdztbggnwowqbtajsgh
npx supabase secrets set OPENAI_API_KEY=your-key-here
npx supabase functions deploy whisper-transcribe
```

### Mac/Linux Installation

```bash
brew install supabase/tap/supabase
```

Or with NPM:
```bash
npm install supabase --save-dev
npx supabase login
```

### Deploy Commands

```bash
# Login
npx supabase login

# Link project
npx supabase link --project-ref njdztbggnwowqbtajsgh

# Set OpenAI API Key (if not already set)
npx supabase secrets set OPENAI_API_KEY=your-openai-api-key

# Deploy the function
npx supabase functions deploy whisper-transcribe

# View logs
npx supabase functions logs whisper-transcribe
```

---

## What Was Fixed?

The key issue was the `instanceof File` check that doesn't work with React Native:

```typescript
// ❌ BROKEN - Always fails for React Native
if (!audioFile || !(audioFile instanceof File)) {
  return new Response(JSON.stringify({ error: 'No audio file provided' }), {
    status: 400
  });
}

// ✅ FIXED - Works with React Native
if (!audioFile) {
  return new Response(JSON.stringify({ error: 'No audio file provided' }), {
    status: 400
  });
}
```

React Native uploads files as Blob-like objects, which fail the `instanceof File` check in Supabase Edge Runtime, causing silent 400 errors that appear as "Network request failed" in the app.

---

## Verify Deployment

After deploying, test from your app:

1. Start Expo: `npx expo start`
2. Open in Expo Go
3. Go to Vocabulary screen
4. Tap microphone and speak Spanish
5. Should see transcription without errors!

---

## Troubleshooting

**Still getting "Network request failed"?**
- Check Edge Function logs in Supabase Dashboard
- Verify OPENAI_API_KEY is set in secrets
- Make sure function is deployed and active

**"OPENAI_API_KEY not configured"?**
- Set it in Project Settings > Edge Functions > Secrets
- Or via CLI: `npx supabase secrets set OPENAI_API_KEY=your-key`

**Can't install CLI?**
- Use the Dashboard method (easiest!)
- Or use `npx supabase` instead of installing globally

---

## Learn More

- [Supabase CLI Install Guide](https://github.com/supabase/cli#install-the-cli)
- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [OpenAI Whisper API](https://platform.openai.com/docs/guides/speech-to-text)
