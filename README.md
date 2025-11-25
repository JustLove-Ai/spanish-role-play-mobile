# Spanish Role Play - Learn Spanish Through Conversation

A React Native mobile app built with Expo that helps users learn Spanish through interactive role-playing scenarios with AI avatars.

## Features

- **Interactive Role-Play Scenarios**: Practice Spanish in real-world contexts
  - On an airplane to Mexico
  - Ordering at a restaurant
  - Checking into a hotel

- **Pre-Lesson Vocabulary**: Learn key phrases before each scenario
  - Spanish phrases with pronunciation guides
  - Audio playback using text-to-speech
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
- **Expo AV** for audio recording
- **Expo Linear Gradient** for beautiful UI effects

## Installation

1. Navigate to the project directory:
```bash
cd SpanishRolePlay
```

2. Install dependencies (already done):
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your device:
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
├── App.js                  # Main navigation setup
├── data/
│   └── scenarios.js        # Demo scenarios and vocabulary data
├── screens/
│   ├── HomeScreen.js       # Scenario selection screen
│   ├── VocabularyScreen.js # Pre-lesson vocabulary review
│   ├── RolePlayScreen.js   # Main conversation screen with AI avatar
│   └── ResultsScreen.js    # Performance summary screen
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

The app requires microphone access for voice recording during role-play sessions. You'll be prompted to grant permission when you first try to record.

## Future Enhancements

- Integration with AI services (OpenAI, Google Cloud Speech-to-Text)
- Real-time speech recognition and evaluation
- More advanced scenarios and difficulty levels
- Progress tracking across sessions
- User profiles and achievement systems
- Additional languages

## Notes

This is a demo version with simulated AI responses. For production use:
1. Integrate a speech-to-text API for transcription
2. Connect to a language model API for dynamic responses
3. Add pronunciation evaluation
4. Implement user authentication and data persistence

## License

MIT

## Support

For issues or questions, please refer to the Expo documentation:
- https://docs.expo.dev/
- https://reactnavigation.org/
