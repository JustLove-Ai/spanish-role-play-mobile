import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon,
  ChartBarIcon,
  HomeIcon,
  ChatBubbleBottomCenterTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon
} from 'react-native-heroicons/solid';

export default function ResultsScreen({ route, navigation }) {
  const { scenario, completedGoals, totalGoals, timeUsed, transcript = [] } = route.params;
  const [showTranscript, setShowTranscript] = useState(false);
  const [grammarAnalysis, setGrammarAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const percentage = Math.round((completedGoals / totalGoals) * 100);
  const isExcellent = percentage >= 90;
  const isGood = percentage >= 70;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getFeedback = () => {
    if (isExcellent) {
      return {
        icon: '🌟',
        title: 'Excellent Work!',
        message: "You've mastered this scenario! Your Spanish conversation skills are improving rapidly."
      };
    } else if (isGood) {
      return {
        icon: '👍',
        title: 'Great Job!',
        message: "You're making good progress! Keep practicing to build more confidence."
      };
    } else {
      return {
        icon: '💪',
        title: 'Keep Going!',
        message: "Every conversation is progress! Try the scenario again to improve your skills."
      };
    }
  };

  const feedback = getFeedback();

  const analyzeGrammar = async () => {
    setIsAnalyzing(true);
    try {
      // TODO: Call AI grammar analysis Edge Function
      // For now, show a placeholder
      await new Promise(resolve => setTimeout(resolve, 2000));
      setGrammarAnalysis({
        summary: "Your Spanish is improving! Here are some areas to focus on:",
        points: [
          {
            type: "good",
            message: "Great use of present tense verbs"
          },
          {
            type: "improve",
            message: "Consider using 'estar' for temporary states instead of 'ser'"
          },
          {
            type: "improve",
            message: "Remember to use gender agreement with adjectives"
          }
        ]
      });
    } catch (error) {
      console.error('Grammar analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isExcellent ? ['#48BB78', '#38A169'] : isGood ? ['#4299E1', '#3182CE'] : ['#ED8936', '#DD6B20']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>{feedback.title}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Your Performance</Text>

          <View style={styles.statItem}>
            <View style={styles.statCircle}>
              <Text style={styles.percentageText}>{percentage}%</Text>
            </View>
            <Text style={styles.statLabel}>Goals Completed</Text>
            <Text style={styles.statValue}>
              {completedGoals} of {totalGoals}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statColumn}>
              <ClockIcon size={28} color="#4A90E2" style={styles.statIcon} />
              <Text style={styles.statColumnValue}>{formatTime(timeUsed)}</Text>
              <Text style={styles.statColumnLabel}>Time Used</Text>
            </View>
            <View style={styles.statColumn}>
              <MapPinIcon size={28} color="#4A90E2" style={styles.statIcon} />
              <Text style={styles.statColumnValue}>{scenario.title}</Text>
              <Text style={styles.statColumnLabel}>Scenario</Text>
            </View>
          </View>
        </View>

        <View style={styles.goalsCard}>
          <Text style={styles.cardTitle}>Goals Review</Text>
          {scenario.goals.map((goal, index) => {
            const completed = index < completedGoals;
            return (
              <View key={goal.id} style={styles.goalItem}>
                <CheckCircleIcon
                  size={24}
                  color={completed ? '#48BB78' : '#CBD5E0'}
                  style={styles.goalIcon}
                />
                <Text
                  style={[
                    styles.goalText,
                    !completed && styles.goalTextIncomplete
                  ]}
                >
                  {goal.content}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.encouragementCard}>
          <ChartBarIcon size={28} color="#22543D" style={styles.encouragementIcon} />
          <Text style={styles.encouragementText}>
            {percentage >= 90
              ? "You're ready for more advanced scenarios! Keep up the amazing work."
              : percentage >= 70
              ? "Practice makes perfect! Try this scenario again or move on to a new one."
              : "Don't worry! Learning a language takes time. Review the vocabulary and try again."}
          </Text>
        </View>

        {/* Conversation Transcript */}
        {transcript.length > 0 && (
          <View style={styles.transcriptCard}>
            <TouchableOpacity
              style={styles.transcriptHeader}
              onPress={() => setShowTranscript(!showTranscript)}
            >
              <View style={styles.transcriptHeaderLeft}>
                <ChatBubbleBottomCenterTextIcon size={24} color="#4A90E2" />
                <Text style={styles.transcriptTitle}>Conversation Transcript</Text>
              </View>
              {showTranscript ? (
                <ChevronUpIcon size={20} color="#718096" />
              ) : (
                <ChevronDownIcon size={20} color="#718096" />
              )}
            </TouchableOpacity>

            {showTranscript && (
              <>
                <View style={styles.transcriptContent}>
                  {transcript.map((entry, index) => (
                    <View
                      key={index}
                      style={[
                        styles.messageRow,
                        entry.speaker === 'You' && styles.messageRowUser
                      ]}
                    >
                      <Text style={styles.messageSpeaker}>{entry.speaker}:</Text>
                      <Text style={styles.messageText}>{entry.message}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.analyzeButton}
                  onPress={analyzeGrammar}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <ActivityIndicator size="small" color="#7C3AED" />
                  ) : (
                    <>
                      <SparklesIcon size={20} color="#7C3AED" />
                      <Text style={styles.analyzeButtonText}>
                        Analyze My Grammar
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {grammarAnalysis && (
                  <View style={styles.analysisCard}>
                    <Text style={styles.analysisSummary}>
                      {grammarAnalysis.summary}
                    </Text>
                    {grammarAnalysis.points.map((point, index) => (
                      <View key={index} style={styles.analysisPoint}>
                        <View
                          style={[
                            styles.analysisDot,
                            point.type === 'good' ? styles.analysisDotGood : styles.analysisDotImprove
                          ]}
                        />
                        <Text style={styles.analysisPointText}>{point.message}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* Add spacing for footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Vocabulary', { scenario })}
        >
          <Text style={styles.secondaryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Home')}
        >
          <HomeIcon size={24} color="white" />
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
    paddingBottom: 16,
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  content: {
    flex: 1
  },
  scrollContent: {
    padding: 20
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 20
  },
  statItem: {
    alignItems: 'center',
    marginBottom: 20
  },
  statCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EDF2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  percentageText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4A90E2'
  },
  statLabel: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 4
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748'
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 20
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  statColumn: {
    alignItems: 'center',
    flex: 1
  },
  statIcon: {
    marginBottom: 8
  },
  statColumnValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
    textAlign: 'center'
  },
  statColumnLabel: {
    fontSize: 12,
    color: '#A0AEC0',
    textAlign: 'center'
  },
  goalsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  goalIcon: {
    marginRight: 12
  },
  goalText: {
    flex: 1,
    fontSize: 15,
    color: '#2D3748',
    fontWeight: '500'
  },
  goalTextIncomplete: {
    color: '#A0AEC0'
  },
  encouragementCard: {
    flexDirection: 'row',
    backgroundColor: '#F0FFF4',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#48BB78'
  },
  encouragementIcon: {
    marginRight: 16
  },
  encouragementText: {
    flex: 1,
    fontSize: 14,
    color: '#22543D',
    lineHeight: 20
  },
  transcriptCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden'
  },
  transcriptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  transcriptHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  transcriptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748'
  },
  transcriptContent: {
    padding: 20,
    gap: 16
  },
  messageRow: {
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4A90E2'
  },
  messageRowUser: {
    backgroundColor: '#EBF8FF',
    borderLeftColor: '#7C3AED'
  },
  messageSpeaker: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 4
  },
  messageText: {
    fontSize: 15,
    color: '#2D3748',
    lineHeight: 22
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F3E8FF',
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7C3AED'
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C3AED'
  },
  analysisCard: {
    backgroundColor: '#FFFAF0',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ED8936'
  },
  analysisSummary: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16
  },
  analysisPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12
  },
  analysisDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6
  },
  analysisDotGood: {
    backgroundColor: '#48BB78'
  },
  analysisDotImprove: {
    backgroundColor: '#ED8936'
  },
  analysisPointText: {
    flex: 1,
    fontSize: 14,
    color: '#2D3748',
    lineHeight: 20
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748'
  },
  primaryButton: {
    width: 56,
    height: 56,
    backgroundColor: '#4A90E2',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
  }
});
