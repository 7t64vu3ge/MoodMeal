import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { TouchableOpacity, Text } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import HomeScreen from './src/screens/HomeScreen'
import LogMealScreen from './src/screens/LogMealScreen'
import LogMoodScreen from './src/screens/LogMoodScreen'
import AnalyticsScreen from './src/screens/AnalyticsScreen'
import SettingsScreen from './src/screens/SettingsScreen'
import { ThemeProvider, useTheme } from './src/context/ThemeContext'

const Stack = createNativeStackNavigator()

function AppContent() {
  const { theme } = useTheme()

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: theme.surface },
          headerTintColor: theme.text,
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: theme.background }
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: 'MoodMeal',
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Text style={{ color: theme.primary, fontSize: 16, fontWeight: '600' }}>Settings</Text>
              </TouchableOpacity>
            )
          })}
        />
        <Stack.Screen name="LogMeal" component={LogMealScreen} options={{ title: 'Log Meal' }} />
        <Stack.Screen name="LogMood" component={LogMoodScreen} options={{ title: 'Log Mood' }} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Analytics' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
