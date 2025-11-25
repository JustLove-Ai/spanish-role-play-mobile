import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function ResultsScreen({ route, navigation }) {
  const { scenario, completedGoals, totalGoals, timeUsed } = route.params;

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

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isExcellent ? ['#48BB78', '#38A169'] : isGood ? ['#4299E1', '#3182CE'] : ['#ED8936', '#DD6B20']}
        style={styles.header}
      >
        <Text style={styles.headerIcon}>{feedback.icon}</Text>
        <Text style={styles.headerTitle}>{feedback.title}</Text>
        <Text style={styles.headerSubtitle}>{feedback.message}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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
              <Text style={styles.statIcon}>⏱️</Text>
              <Text style={styles.statColumnValue}>{formatTime(timeUsed)}</Text>
              <Text style={styles.statColumnLabel}>Time Used</Text>
            </View>
            <View style={styles.statColumn}>
              <Text style={styles.statIcon}>🎯</Text>
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
                <View
                  style={[
                    styles.goalCheckbox,
                    completed && styles.goalCheckboxCompleted
                  ]}
                >
                  {completed && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text
                  style={[
                    styles.goalText,
                    completed && styles.goalTextCompleted
                  ]}
                >
                  {goal.content}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.encouragementCard}>
          <Text style={styles.encouragementIcon}>📈</Text>
          <Text style={styles.encouragementText}>
            {percentage >= 90
              ? "You're ready for more advanced scenarios! Keep up the amazing work."
              : percentage >= 70
              ? "Practice makes perfect! Try this scenario again or move on to a new one."
              : "Don't worry! Learning a language takes time. Review the vocabulary and try again."}
          </Text>
        </View>
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
          <Text style={styles.primaryButtonText}>New Scenario</Text>
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
    padding: 30,
    paddingTop: 50,
    paddingBottom: 40,
    alignItems: 'center'
  },
  headerIcon: {
    fontSize: 60,
    marginBottom: 16
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    paddingHorizontal: 20
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100
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
    fontSize: 32,
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
  goalCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#CBD5E0',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  goalCheckboxCompleted: {
    backgroundColor: '#48BB78',
    borderColor: '#48BB78'
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  goalText: {
    flex: 1,
    fontSize: 15,
    color: '#4A5568'
  },
  goalTextCompleted: {
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
    fontSize: 32,
    marginRight: 16
  },
  encouragementText: {
    flex: 1,
    fontSize: 14,
    color: '#22543D',
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
    flex: 1,
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white'
  }
});
