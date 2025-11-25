# Spanish Role Play - Learn Spanish Through Conversation

A React Native mobile app built with Expo that helps users learn Spanish through interactive role-playing scenarios with AI avatars.

## Features

- **Interactive Role-Play Scenarios**: Practice Spanish in real-world contexts
  - On an airplane to Mexico
  - Ordering at a restaurant
  - Checking into a hotel

- **Pre-Lesson Vocabulary**: Learn key phrases before each scenario
  - Spanish phrases with audio playback
  - Speech recognition with OpenAI Whisper
  - Real-time pronunciation verification
  - Retry system with feedback (2 attempts before moving on)
  - English translations

- **AI Avatar Conversations**: Speak with AI characters
  - Voice recording and playback
  - Realistic conversation flow
  - Goal-based progression

- **Goal Tracking**: Complete specific objectives in each scenario
- **Timer System**: Time-limited practice sessions
- **Results Screen**: See your performance and progress

## Tech Stack

- **React Native** with Expo
- **Expo Go** compatible (no custom native code)
- **React Navigation** for screen navigation
- **Expo Speech** for text-to-speech
- **Expo Audio** for audio recording
- **Expo Linear Gradient** for beautiful UI effects
- **OpenAI Whisper REST API** for speech-to-text transcription (via fetch)
- **React Native Heroicons** for consistent iconography

## Installation

1. Navigate to the project directory:
```bash
cd SpanishRolePlay
```

2. Install dependencies:
```bash
npm install
```

3. Set up OpenAI API Key:

**Important**: Get your API key from https://platform.openai.com/api-keys

Edit `services/whisperService.js` and replace the API key:
```javascript
const OPENAI_API_KEY = 'your-actual-openai-api-key-here';
```

**Security Note**: In production, API calls should be made from a backend server to keep your API key secure. Never expose API keys in client-side code in production.

4. Start the development server:
```bash
npx expo start
```

5. Run on your device:
   - Download **Expo Go** app on your iOS or Android device
   - Scan the QR code from the terminal
   - Or press `a` for Android emulator or `i` for iOS simulator

## How to Use

1. **Choose a Scenario**: Select from available conversation scenarios
2. **Learn Vocabulary**: Review key phrases and practice pronunciation
3. **Start Role Play**: Have a conversation with the AI avatar using your microphone
4. **Complete Goals**: Work through conversation objectives within the time limit
5. **View Results**: See how well you performed and what you accomplished

## Project Structure

```
SpanishRolePlay/
├── App.js                   # Main navigation setup
├── data/
│   └── scenarios.js         # Demo scenarios and vocabulary data
├── screens/
│   ├── HomeScreen.js        # Scenario selection screen
│   ├── VocabularyScreen.js  # Pre-lesson vocabulary with speech verification
│   ├── GoalsScreen.js       # Goals preview before role play
│   ├── RolePlayScreen.js    # Main conversation screen with AI avatar
│   ├── ResultsScreen.js     # Performance summary screen
│   └── DayStreakScreen.js   # Day streak celebration screen
├── services/
│   └── whisperService.js    # OpenAI Whisper API integration
├── .env.example             # Environment variables template
└── README.md
```

## Demo Content

The app comes with 3 demo scenarios:
1. **On the Airplane to Mexico** - Practice travel-related conversations
2. **Ordering at a Restaurant** - Learn food and ordering vocabulary
3. **Checking into a Hotel** - Master accommodation-related phrases

Each scenario includes:
- 5-6 essential vocabulary phrases
- 4 conversation goals
- 5-minute time limit
- AI character with personality

## Customization

To add new scenarios, edit `data/scenarios.js` and follow the existing structure:

```javascript
{
  id: 4,
  title: "Your Scenario Title",
  description: "Scenario description",
  avatar: "avatar-url",
  avatarName: "Character Name",
  duration: 300, // seconds
  vocabulary: [...],
  goals: [...],
  aiResponses: [...]
}
```

## Permissions

The app requires microphone access for voice recording and pronunciation verification. You'll be prompted to grant permission when you first try to record.

## Speech Verification

The app uses OpenAI's Whisper API to:
1. Transcribe your spoken Spanish
2. Compare it with the expected phrase
3. Provide immediate feedback on pronunciation accuracy
4. Calculate similarity score using Levenshtein distance
5. Allow up to 2 retry attempts before moving on

**Scoring**:
- 100%: Perfect match
- 80-99%: Great job (accepted as correct)
- 60-79%: Close, try again
- < 60%: Try again

## Future Enhancements

- Backend API server for secure OpenAI key storage
- More advanced scenarios and difficulty levels
- Progress tracking across sessions
- User profiles and achievement systems
- Additional languages
- Voice analysis and accent coaching

## License

MIT

## Support

For issues or questions, please refer to the Expo documentation:
- https://docs.expo.dev/
- https://reactnavigation.org/
