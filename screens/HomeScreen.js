import React, { useState } from 'react';
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
import {
  ClockIcon,
  BookOpenIcon,
  FlagIcon,
  FireIcon
} from 'react-native-heroicons/solid';

export default function HomeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Travel', 'Food', 'Hotel'];

  const featuredScenario = scenarios[0];
  const recentScenarios = scenarios.slice(1);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>For you</Text>
        <View style={styles.streak}>
          <FireIcon size={20} color="#FF6B35" />
          <Text style={styles.streakText}>3</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categories}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.featuredCard}
          onPress={() => navigation.navigate('Vocabulary', { scenario: featuredScenario })}
        >
          <LinearGradient
            colors={['#4A90E2', '#357ABD']}
            style={styles.featuredGradient}
          >
            <View style={styles.avatarBadge}>
              <Image
                source={{ uri: featuredScenario.avatar }}
                style={styles.featuredAvatar}
              />
            </View>
            <Text style={styles.featuredTitle}>{featuredScenario.title}</Text>
            <Text style={styles.featuredDescription}>
              {featuredScenario.description}
            </Text>
            <Text style={styles.featuredAuthor}>— {featuredScenario.avatarName}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Recently added</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentScenarios}
        >
          {recentScenarios.map((scenario) => (
            <TouchableOpacity
              key={scenario.id}
              style={styles.recentCard}
              onPress={() => navigation.navigate('Vocabulary', { scenario })}
            >
              <Image
                source={{ uri: scenario.avatar }}
                style={styles.recentImage}
              />
              <View style={styles.recentOverlay}>
                <Text style={styles.recentTitle}>{scenario.title}</Text>
                <View style={styles.recentMeta}>
                  <ClockIcon size={12} color="white" />
                  <Text style={styles.recentMetaText}>
                    {Math.floor(scenario.duration / 60)} min
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>All Scenarios</Text>

        {scenarios.map((scenario) => (
          <TouchableOpacity
            key={scenario.id}
            style={styles.scenarioCard}
            onPress={() => navigation.navigate('Vocabulary', { scenario })}
          >
            <Image
              source={{ uri: scenario.avatar }}
              style={styles.scenarioImage}
            />
            <View style={styles.scenarioInfo}>
              <Text style={styles.scenarioTitle}>{scenario.title}</Text>
              <Text style={styles.scenarioDescription} numberOfLines={2}>
                {scenario.description}
              </Text>
              <View style={styles.scenarioMeta}>
                <View style={styles.metaItem}>
                  <ClockIcon size={14} color="#A0AEC0" />
                  <Text style={styles.metaText}>
                    {Math.floor(scenario.duration / 60)} min
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <BookOpenIcon size={14} color="#A0AEC0" />
                  <Text style={styles.metaText}>
                    {scenario.words.length + scenario.phrases.length}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <FlagIcon size={14} color="#A0AEC0" />
                  <Text style={styles.metaText}>
                    {scenario.goals.length}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A202C'
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4
  },
  streakText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35'
  },
  scrollView: {
    flex: 1
  },
  categories: {
    paddingLeft: 20,
    marginBottom: 20
  },
  categoriesContent: {
    gap: 8,
    paddingRight: 20
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F7FAFC'
  },
  categoryChipActive: {
    backgroundColor: '#4A90E2'
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568'
  },
  categoryTextActive: {
    color: 'white'
  },
  featuredCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6
  },
  featuredGradient: {
    padding: 24,
    minHeight: 240,
    justifyContent: 'flex-end'
  },
  avatarBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    padding: 3
  },
  featuredAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8
  },
  featuredDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 8,
    lineHeight: 22
  },
  featuredAuthor: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 16,
    paddingHorizontal: 20
  },
  recentScenarios: {
    paddingLeft: 20,
    paddingRight: 20,
    gap: 12,
    marginBottom: 32
  },
  recentCard: {
    width: 160,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F7FAFC'
  },
  recentImage: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  recentOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6
  },
  recentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  recentMetaText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '500'
  },
  scenarioCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  scenarioImage: {
    width: 100,
    height: 100
  },
  scenarioInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center'
  },
  scenarioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4
  },
  scenarioDescription: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 8,
    lineHeight: 18
  },
  scenarioMeta: {
    flexDirection: 'row',
    gap: 12
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  metaText: {
    fontSize: 11,
    color: '#A0AEC0',
    fontWeight: '500'
  }
});
