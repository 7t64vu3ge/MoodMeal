import React, { useState } from 'react'
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { StorageService } from '../services/StorageService'
import { useTheme } from '../context/ThemeContext'
import { SPACING, FONTS, SHADOWS } from '../constants/theme'

const MOODS = [
  { label: 'Happy', emoji: '😊', value: 5 },
  { label: 'Energetic', emoji: '⚡', value: 4 },
  { label: 'Neutral', emoji: '😐', value: 3 },
  { label: 'Tired', emoji: '😴', value: 2 },
  { label: 'Sad', emoji: '😢', value: 1 },
  { label: 'Stressed', emoji: '😫', value: 1 }
]

export default function LogMoodScreen({ navigation }) {
  const { theme } = useTheme()
  const [selectedMood, setSelectedMood] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!selectedMood) {
      Alert.alert('Error', 'Please select a mood')
      return
    }

    setLoading(true)
    const moodLog = {
      id: Date.now().toString(),
      mood: selectedMood.label,
      value: selectedMood.value,
      emoji: selectedMood.emoji,
      timestamp: new Date().toISOString()
    }

    // save mood to storage
    const success = await StorageService.saveMood(moodLog)
    setLoading(false)

    if (success) {
      Alert.alert('Success', 'Mood logged successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ])
    } else {
      Alert.alert('Error', 'Failed to save mood')
    }
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.label, { color: theme.text }]}>How are you feeling?</Text>

      <View style={styles.grid}>
        {MOODS.map((mood) => (
          <TouchableOpacity
            key={mood.label}
            style={[
              styles.moodButton,
              { backgroundColor: theme.surface },
              selectedMood?.label === mood.label && { borderColor: theme.primary, backgroundColor: theme.isDark ? '#2C3E50' : '#F0F8FF' }
            ]}
            onPress={() => setSelectedMood(mood)}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={[
              styles.moodText,
              { color: theme.textSecondary },
              selectedMood?.label === mood.label && { color: theme.primary, fontWeight: 'bold' }
            ]}>
              {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.secondary }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.surface} />
          ) : (
            <Text style={[styles.saveButtonText, { color: theme.surface }]}>Save Mood</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: SPACING.m,
    alignItems: 'center'
  },
  label: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: SPACING.xl,
    marginTop: SPACING.l,
    fontFamily: FONTS.bold
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.m
  },
  moodButton: {
    width: '45%',
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
    marginBottom: SPACING.m,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  emoji: {
    fontSize: 40,
    marginBottom: SPACING.s
  },
  moodText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: FONTS.medium
  },
  buttonContainer: {
    width: '100%',
    marginTop: SPACING.xl
  },
  saveButton: {
    paddingVertical: SPACING.m,
    borderRadius: 12,
    alignItems: 'center',
    ...SHADOWS.medium
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.bold
  }
})
