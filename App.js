import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from './screens/HomeScreen';
import VocabularyScreen from './screens/VocabularyScreen';
import GoalsScreen from './screens/GoalsScreen';
import RolePlayScreen from './screens/RolePlayScreen';
import ResultsScreen from './screens/ResultsScreen';
import DayStreakScreen from './screens/DayStreakScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#F7FAFC' }
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Vocabulary" component={VocabularyScreen} />
          <Stack.Screen name="Goals" component={GoalsScreen} />
          <Stack.Screen name="RolePlay" component={RolePlayScreen} />
          <Stack.Screen name="Results" component={ResultsScreen} />
          <Stack.Screen name="DayStreak" component={DayStreakScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
