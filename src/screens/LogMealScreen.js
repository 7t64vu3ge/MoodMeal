import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { StorageService } from '../services/StorageService'
import { useTheme } from '../context/ThemeContext'
import { SPACING, FONTS, SHADOWS } from '../constants/theme'

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

export default function LogMealScreen({ navigation }) {
  const { theme } = useTheme()
  const [foodName, setFoodName] = useState('')
  const [category, setCategory] = useState('Breakfast')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    // check if empty
    if (!foodName.trim()) {
      Alert.alert('Error', 'Please enter a food name')
      return
    }

    setLoading(true)
    const meal = {
      id: Date.now().toString(),
      foodName,
      category,
      timestamp: new Date().toISOString()
    }

    // save to storage
    const success = await StorageService.saveMeal(meal)
    setLoading(false)

    if (success) {
      Alert.alert('Success', 'Meal logged successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ])
    } else {
      Alert.alert('Error', 'Failed to save meal')
    }
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.label, { color: theme.text }]}>What did you eat?</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
        placeholder="e.g., Oatmeal, Pizza, Apple"
        placeholderTextColor={theme.textSecondary}
        value={foodName}
        onChangeText={setFoodName}
      />

      <Text style={[styles.label, { color: theme.text }]}>Category</Text>
      <View style={styles.categoryContainer}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              { backgroundColor: theme.surface, borderColor: theme.border },
              category === cat && { backgroundColor: theme.primary, borderColor: theme.primary }
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                { color: theme.text },
                category === cat && { color: theme.surface, fontWeight: 'bold' }
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.surface} />
          ) : (
            <Text style={[styles.saveButtonText, { color: theme.surface }]}>Save Meal</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: SPACING.m
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: SPACING.s,
    marginTop: SPACING.m,
    fontFamily: FONTS.medium
  },
  input: {
    padding: SPACING.m,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    fontFamily: FONTS.regular
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.l,
    gap: SPACING.s
  },
  categoryButton: {
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    borderRadius: 20,
    borderWidth: 1
  },
  categoryText: {
    fontSize: 14,
    fontFamily: FONTS.medium
  },
  buttonContainer: {
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
