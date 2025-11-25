import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircleIcon } from 'react-native-heroicons/outline';
import { FireIcon } from 'react-native-heroicons/solid';

export default function GoalsScreen({ route, navigation }) {
  const { scenario, earnedPoints = 0 } = route.params;

  const handleStartRolePlay = () => {
    navigation.navigate('RolePlay', { scenario, earnedPoints });
  };

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
            <Text style={styles.headerSubtitle}>Your Goals</Text>
            <Text style={styles.headerTitle}>{scenario.title}</Text>
          </View>
          <View style={styles.pointsBadge}>
            <FireIcon size={18} color="white" />
            <Text style={styles.pointsText}>{earnedPoints}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.instructionText}>
          Have a conversation with {scenario.avatarName}. Try to complete these goals:
        </Text>

        <View style={styles.goalsCard}>
          {scenario.goals.map((goal, index) => (
            <View key={goal.id} style={styles.goalItem}>
              <CheckCircleIcon size={24} color="#4A90E2" style={styles.goalIcon} />
              <Text style={styles.goalText}>{goal.content}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartRolePlay}
        >
          <LinearGradient
            colors={['#4A90E2', '#357ABD']}
            style={styles.startButtonGradient}
          >
            <Text style={styles.startButtonText}>Start Conversation</Text>
          </LinearGradient>
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
    paddingHorizontal: 20,
    paddingTop: 32,
    justifyContent: 'center'
  },
  instructionText: {
    fontSize: 18,
    color: '#4A5568',
    marginBottom: 24,
    lineHeight: 26,
    textAlign: 'center'
  },
  goalsCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  goalIcon: {
    marginRight: 16
  },
  goalText: {
    flex: 1,
    fontSize: 16,
    color: '#2D3748',
    fontWeight: '500',
    lineHeight: 22
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0'
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6
  },
  startButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  }
});
