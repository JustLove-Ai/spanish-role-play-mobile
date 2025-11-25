import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated
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
import { SpeakerWaveIcon, MicrophoneIcon, PauseIcon } from 'react-native-heroicons/solid';
import { FireIcon } from 'react-native-heroicons/solid';

export default function VocabularyScreen({ route, navigation }) {
  const { scenario } = route.params;
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const learningItems = [
    ...scenario.words.map(item => ({ ...item, type: 'word' })),
    ...scenario.phrases.map(item => ({ ...item, type: 'phrase' }))
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [points, setPoints] = useState(0);
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    speakPhrase(learningItems[currentIndex].spanish);
  }, [currentIndex]);

  useEffect(() => {
    checkPermissions();
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

  const speakPhrase = (text) => {
    Speech.speak(text, {
      language: 'es-MX',
      pitch: 1.0,
      rate: 0.75
    });
  };

  const animateSuccess = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
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
      await recorder.stop();
      setHasRecorded(true);

      const earnedPoints = learningItems[currentIndex].type === 'word' ? 5 : 10;
      setPoints(points + earnedPoints);
      animateSuccess();
      setIsProcessing(false);
    } catch (err) {
      console.error('Failed to stop recording', err);
      setIsProcessing(false);
      Alert.alert('Recording Error', 'Unable to stop recording.');
    }
  };

  const handleNext = () => {
    if (currentIndex < learningItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setHasRecorded(false);
    } else {
      navigation.navigate('Goals', { scenario, earnedPoints: points });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setHasRecorded(false);
    }
  };

  const handleSkipToRolePlay = () => {
    Alert.alert(
      'Skip to Role Play?',
      'Practicing helps, but you can skip ahead!',
      [
        { text: 'Keep Learning', style: 'cancel' },
        { text: 'Skip', onPress: () => navigation.navigate('Goals', { scenario, earnedPoints: points }) }
      ]
    );
  };

  const currentItem = learningItems[currentIndex];
  const isLastItem = currentIndex === learningItems.length - 1;
  const progressPercentage = ((currentIndex + 1) / learningItems.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4A90E2', '#63B3ED']}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerSubtitle}>Here's What You Need to Know</Text>
            <Text style={styles.headerTitle}>{scenario.title}</Text>
          </View>
          <Animated.View style={[styles.pointsBadge, { transform: [{ scale: scaleAnim }] }]}>
            <FireIcon size={18} color="white" />
            <Text style={styles.pointsText}>{points}</Text>
          </Animated.View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>{currentIndex + 1} of {learningItems.length}</Text>
          <TouchableOpacity onPress={handleSkipToRolePlay}>
            <Text style={styles.skipText}>Skip →</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
        </View>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.speakerIcon}
            onPress={() => speakPhrase(currentItem.spanish)}
          >
            <SpeakerWaveIcon size={22} color="#4A90E2" />
          </TouchableOpacity>

          <Text style={styles.spanish}>{currentItem.spanish}</Text>

          <View style={styles.meaningSection}>
            <Text style={styles.english}>{currentItem.english}</Text>
          </View>

          {hasRecorded && (
            <View style={styles.successBadge}>
              <Text style={styles.successText}>
                +{learningItems[currentIndex].type === 'word' ? '5' : '10'} points!
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navIcon}>‹</Text>
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

        <TouchableOpacity
          style={[
            styles.navButton,
            !hasRecorded && styles.navButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!hasRecorded}
        >
          <Text style={styles.navIcon}>›</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 20
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backText: {
    color: 'white',
    fontSize: 44,
    fontWeight: '300'
  },
  headerCenter: {
    flex: 1,
    paddingHorizontal: 12
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600'
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 2
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4
  },
  pointsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 16
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  progressText: {
    fontSize: 13,
    color: '#718096',
    fontWeight: '600'
  },
  skipText: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: '600'
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 2
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 40,
    paddingTop: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    position: 'relative'
  },
  speakerIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  spanish: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.3
  },
  meaningSection: {
    paddingVertical: 18,
    paddingHorizontal: 28,
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    marginBottom: 20,
    width: '100%'
  },
  english: {
    fontSize: 18,
    color: '#4A5568',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 26
  },
  successBadge: {
    backgroundColor: '#C6F6D5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 16
  },
  successText: {
    color: '#22543D',
    fontSize: 16,
    fontWeight: 'bold'
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 20,
    paddingBottom: 30,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0'
  },
  navButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  navButtonDisabled: {
    opacity: 0.3
  },
  navIcon: {
    fontSize: 36,
    fontWeight: '300',
    color: '#4A90E2'
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    marginHorizontal: 20
  },
  micButtonActive: {
    backgroundColor: '#FC8181',
    shadowColor: '#FC8181'
  },
  micButtonDisabled: {
    opacity: 0.6
  }
});
