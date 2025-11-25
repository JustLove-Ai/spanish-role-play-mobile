import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import {
  useAudioRecorder,
  RecordingPresets,
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
  setAudioModeAsync
} from 'expo-audio';
import {
  BookOpenIcon,
  ClipboardDocumentListIcon,
  MicrophoneIcon,
  PauseIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon
} from 'react-native-heroicons/solid';
import { transcribeAudio } from '../services/whisperService';

export default function RolePlayScreen({ route, navigation }) {
  const { scenario, earnedPoints = 0 } = route.params;
  const [timeRemaining, setTimeRemaining] = useState(scenario.duration);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [goals, setGoals] = useState(scenario.goals);
  const [showGuide, setShowGuide] = useState(false);
  const [conversationIndex, setConversationIndex] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVocab, setShowVocab] = useState(false);
  const [transcript, setTranscript] = useState([]);

  const allVocab = [
    ...scenario.words.map(item => ({ ...item, type: 'word' })),
    ...scenario.phrases.map(item => ({ ...item, type: 'phrase' }))
  ];

  useEffect(() => {
    checkPermissions();

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleEndSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => {
      speakAIMessage(scenario.aiResponses[0]);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const checkPermissions = async () => {
    try {
      const result = await getRecordingPermissionsAsync();
      setPermissionGranted(result.granted);
    } catch (err) {
      console.error('Failed to check permissions', err);
      setPermissionGranted(false);
    }
  };

  const speakAIMessage = (text) => {
    setCurrentMessage(text);
    // Add AI message to transcript
    setTranscript(prev => [...prev, {
      speaker: scenario.avatarName,
      message: text,
      timestamp: new Date().toISOString()
    }]);
    Speech.speak(text, {
      language: 'es-MX',
      pitch: 1.0,
      rate: 0.85
    });
  };

  const toggleRecording = async () => {
    if (recorder.isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      setIsProcessing(true);

      if (!permissionGranted) {
        const result = await requestRecordingPermissionsAsync();
        if (!result.granted) {
          Alert.alert(
            'Permission Denied',
            'Please enable microphone access in your device settings.'
          );
          setIsProcessing(false);
          return;
        }
        setPermissionGranted(true);
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await recorder.prepareToRecordAsync();
      recorder.record();
      setIsProcessing(false);
    } catch (err) {
      console.error('Failed to start recording', err);
      setIsProcessing(false);
      Alert.alert('Recording Error', 'Unable to start recording.');
    }
  };

  const stopRecording = async () => {
    if (!recorder.isRecording) return;

    try {
      setIsProcessing(true);
      const recordingResult = await recorder.stop();

      // Extract and prepare URI for transcription
      const uri = typeof recordingResult === 'string'
        ? recordingResult
        : (recordingResult?.url || recordingResult?.uri);

      if (uri && typeof uri === 'string') {
        try {
          // Add file:// prefix if missing
          const fileUri = uri.startsWith('file://') ? uri : `file://${uri}`;

          // Transcribe user's response
          const userResponse = await transcribeAudio(fileUri);

          // Add user message to transcript
          setTranscript(prev => [...prev, {
            speaker: 'You',
            message: userResponse,
            timestamp: new Date().toISOString()
          }]);
        } catch (transcribeErr) {
          console.error('Failed to transcribe user response:', transcribeErr);
          // Add placeholder if transcription fails
          setTranscript(prev => [...prev, {
            speaker: 'You',
            message: '[Audio recorded]',
            timestamp: new Date().toISOString()
          }]);
        }
      }

      setIsProcessing(false);

      setTimeout(() => {
        const nextIndex = conversationIndex + 1;
        if (nextIndex < scenario.aiResponses.length) {
          setConversationIndex(nextIndex);
          speakAIMessage(scenario.aiResponses[nextIndex]);

          if (Math.random() > 0.5 && goals.some(g => !g.completed)) {
            const incompleteGoals = goals.filter(g => !g.completed);
            const randomGoal = incompleteGoals[Math.floor(Math.random() * incompleteGoals.length)];
            toggleGoal(randomGoal.id);
          }
        }
      }, 1500);
    } catch (err) {
      console.error('Failed to stop recording', err);
      setIsProcessing(false);
      Alert.alert('Recording Error', 'Unable to stop recording.');
    }
  };

  const toggleGoal = (goalId) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const handleEndSession = () => {
    const completedGoals = goals.filter((g) => g.completed).length;
    const totalGoals = goals.length;

    navigation.navigate('Results', {
      scenario,
      completedGoals,
      totalGoals,
      earnedPoints,
      timeUsed: scenario.duration - timeRemaining,
      transcript
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completedGoalsCount = goals.filter((g) => g.completed).length;
  const allGoalsCompleted = completedGoalsCount === goals.length;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4A90E2', '#63B3ED']}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.scenarioName}>{scenario.title}</Text>
            <View style={styles.timerContainer}>
              <ClockIcon size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.endButton}
            onPress={handleEndSession}
          >
            <Text style={styles.endButtonText}>End</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.mainContent}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: scenario.avatar }}
              style={styles.avatar}
            />
            {currentMessage && (
              <View style={styles.speechBubble}>
                <Text style={styles.speechText}>{currentMessage}</Text>
              </View>
            )}
          </View>
          <Text style={styles.avatarName}>{scenario.avatarName}</Text>
        </View>

        <View style={styles.vocabBar}>
          <TouchableOpacity
            style={styles.vocabButton}
            onPress={() => setShowVocab(!showVocab)}
          >
            <BookOpenIcon size={20} color="#4A90E2" style={styles.vocabIcon} />
            <Text style={styles.vocabLabel}>Vocabulary</Text>
          </TouchableOpacity>
        </View>

        {showVocab && (
          <View style={styles.vocabPanel}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {allVocab.map((item, index) => (
                <View key={index} style={styles.vocabCard}>
                  <Text style={styles.vocabSpanish}>{item.spanish}</Text>
                  <Text style={styles.vocabEnglish}>{item.english}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setShowGuide(true)}
          >
            <ClipboardDocumentListIcon size={28} color="#4A90E2" style={styles.controlIcon} />
            <Text style={styles.controlLabel}>Goals</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.micButton,
              recorder.isRecording && styles.micButtonActive,
              isProcessing && styles.micButtonDisabled
            ]}
            onPress={toggleRecording}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="white" size="large" />
            ) : recorder.isRecording ? (
              <PauseIcon size={36} color="white" />
            ) : (
              <MicrophoneIcon size={36} color="white" />
            )}
          </TouchableOpacity>

          <View style={styles.controlButton}>
            <Text style={styles.goalsCount}>
              {completedGoalsCount}/{goals.length}
            </Text>
            <Text style={styles.controlLabel}>Completed</Text>
          </View>
        </View>
      </View>

      <Modal
        visible={showGuide}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGuide(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Goals</Text>
              <TouchableOpacity
                onPress={() => setShowGuide(false)}
                style={styles.closeButton}
              >
                <XMarkIcon size={24} color="#718096" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {goals.map((goal, index) => (
                <View key={goal.id} style={styles.goalItem}>
                  <Text style={styles.goalNumber}>{index + 1}</Text>
                  <Text
                    style={[
                      styles.goalText,
                      goal.completed && styles.goalCompleted
                    ]}
                  >
                    {goal.content}
                  </Text>
                  {goal.completed && (
                    <CheckCircleIcon size={24} color="#48BB78" style={styles.checkmark} />
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {allGoalsCompleted && (
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <Text style={styles.successIcon}>🎉</Text>
            <Text style={styles.successTitle}>All goals completed!</Text>
            <Text style={styles.successText}>
              Great job! You can end the session now.
            </Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={handleEndSession}
            >
              <Text style={styles.successButtonText}>End Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC'
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerLeft: {
    flex: 1
  },
  scenarioName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  timer: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)'
  },
  endButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12
  },
  endButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14
  },
  mainContent: {
    flex: 1
  },
  avatarSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: 'white'
  },
  speechBubble: {
    position: 'absolute',
    bottom: -50,
    left: -40,
    right: -40,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  speechText: {
    fontSize: 15,
    color: '#2D3748',
    textAlign: 'center',
    fontWeight: '500'
  },
  avatarName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginTop: 50
  },
  vocabBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: 'white'
  },
  vocabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  },
  vocabIcon: {
    marginRight: 8
  },
  vocabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2'
  },
  vocabPanel: {
    backgroundColor: '#F7FAFC',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  vocabCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  vocabSpanish: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4
  },
  vocabEnglish: {
    fontSize: 13,
    color: '#718096'
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0'
  },
  controlButton: {
    alignItems: 'center'
  },
  controlIcon: {
    marginBottom: 4
  },
  controlLabel: {
    fontSize: 11,
    color: '#718096',
    fontWeight: '500'
  },
  goalsCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4
  },
  micButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
  },
  micButtonActive: {
    backgroundColor: '#FC8181'
  },
  micButtonDisabled: {
    opacity: 0.6
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748'
  },
  closeButton: {
    padding: 4
  },
  modalBody: {
    padding: 20
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12
  },
  goalNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginRight: 12
  },
  goalText: {
    flex: 1,
    fontSize: 14,
    color: '#2D3748'
  },
  goalCompleted: {
    textDecorationLine: 'line-through',
    color: '#A0AEC0'
  },
  checkmark: {
    marginLeft: 8
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  successCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    maxWidth: 300
  },
  successIcon: {
    fontSize: 60,
    marginBottom: 16
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
    textAlign: 'center'
  },
  successText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 24
  },
  successButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12
  },
  successButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});
