import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { scenarios } from '../data/scenarios';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Spanish Role Play</Text>
        <Text style={styles.headerSubtitle}>
          Learn Spanish through real conversations
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Choose Your Scenario</Text>

        {scenarios.map((scenario) => (
          <TouchableOpacity
            key={scenario.id}
            style={styles.scenarioCard}
            onPress={() =>
              navigation.navigate('Vocabulary', { scenario })
            }
          >
            <Image
              source={{ uri: scenario.avatar }}
              style={styles.scenarioAvatar}
            />
            <View style={styles.scenarioInfo}>
              <Text style={styles.scenarioTitle}>{scenario.title}</Text>
              <Text style={styles.scenarioDescription}>
                {scenario.description}
              </Text>
              <View style={styles.scenarioMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaIcon}>⏱️</Text>
                  <Text style={styles.metaText}>
                    {Math.floor(scenario.duration / 60)} min
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaIcon}>📚</Text>
                  <Text style={styles.metaText}>
                    {scenario.words.length + scenario.phrases.length} items
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaIcon}>🎯</Text>
                  <Text style={styles.metaText}>
                    {scenario.goals.length} goals
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>How it works</Text>
            <Text style={styles.tipText}>
              1. Learn key phrases before starting{'\n'}
              2. Practice speaking with an AI character{'\n'}
              3. Complete goals through natural conversation{'\n'}
              4. Build confidence in real-world situations
            </Text>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 40
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)'
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16
  },
  scenarioCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  scenarioAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16
  },
  scenarioInfo: {
    flex: 1
  },
  scenarioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 6
  },
  scenarioDescription: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 12,
    lineHeight: 18
  },
  scenarioMeta: {
    flexDirection: 'row',
    gap: 12
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  metaIcon: {
    fontSize: 14,
    marginRight: 4
  },
  metaText: {
    fontSize: 12,
    color: '#A0AEC0'
  },
  arrow: {
    fontSize: 24,
    color: '#CBD5E0',
    marginLeft: 8
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#EBF8FF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4299E1'
  },
  tipIcon: {
    fontSize: 32,
    marginRight: 16
  },
  tipContent: {
    flex: 1
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C5282',
    marginBottom: 8
  },
  tipText: {
    fontSize: 14,
    color: '#2C5282',
    lineHeight: 22
  }
});
