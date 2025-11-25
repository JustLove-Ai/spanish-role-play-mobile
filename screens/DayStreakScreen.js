import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FireIcon } from 'react-native-heroicons/solid';

export default function DayStreakScreen({ route, navigation }) {
  const { dayStreak = 1 } = route.params || {};

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const daysUntilMilestone = 7 - dayStreak;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.flameContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.flameCircle}>
            <FireIcon size={80} color="#FF6B35" />
          </View>
        </Animated.View>

        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <Text style={styles.streakNumber}>{dayStreak}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
          <Text style={styles.streakSubtext}>
            {dayStreak === 1
              ? '1 activity, 0 Kai sessions'
              : `${dayStreak} activities, ${Math.floor(dayStreak / 2)} Kai sessions`}
          </Text>

          <View style={styles.calendar}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <View key={index} style={styles.dayContainer}>
                <View
                  style={[
                    styles.dayCircle,
                    index < dayStreak && styles.dayCircleActive,
                  ]}
                >
                  {index < dayStreak && <FireIcon size={12} color="#7C3AED" />}
                </View>
                <Text style={styles.dayLabel}>{day}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.milestone}>
            {daysUntilMilestone > 0
              ? `${daysUntilMilestone} more days`
              : 'Milestone reached!'}
          </Text>
          <Text style={styles.milestoneSubtext}>
            {daysUntilMilestone > 0
              ? 'to unlock your Mind Map'
              : 'You unlocked your Mind Map!'}
          </Text>

          <View style={styles.actions}>
            <View style={styles.actionItem}>
              <FireIcon size={20} color="#7C3AED" />
              <Text style={styles.actionText}>Talk with Kai</Text>
            </View>
            <View style={styles.actionItem}>
              <FireIcon size={20} color="#7C3AED" />
              <Text style={styles.actionText}>Complete activities</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  closeText: {
    fontSize: 36,
    color: '#A0AEC0',
    fontWeight: '300'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40
  },
  flameContainer: {
    marginBottom: 32
  },
  flameCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10
  },
  textContainer: {
    alignItems: 'center',
    width: '100%'
  },
  streakNumber: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8
  },
  streakLabel: {
    fontSize: 24,
    color: '#4A5568',
    marginBottom: 8
  },
  streakSubtext: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 32
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
    paddingHorizontal: 20
  },
  dayContainer: {
    alignItems: 'center'
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6
  },
  dayCircleActive: {
    backgroundColor: '#EDE9FE'
  },
  dayLabel: {
    fontSize: 11,
    color: '#A0AEC0',
    fontWeight: '600'
  },
  milestone: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
    marginBottom: 4
  },
  milestoneSubtext: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 32
  },
  actions: {
    width: '100%',
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    padding: 20,
    gap: 16
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  actionText: {
    fontSize: 14,
    color: '#2D3748',
    fontWeight: '500'
  },
  continueButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#7C3AED',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  }
});
